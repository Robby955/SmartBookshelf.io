# app.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
import os
import logging
import traceback
import torch
import cv2
import numpy as np
import aiohttp
from urllib.parse import quote

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set environment variable for Google Application Credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Ensure the uploads directory exists
uploads_dir = 'uploads'
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

def resize_image(image, max_width=400, max_height=600):
    """Resize an image while maintaining aspect ratio."""
    h, w = image.shape[:2]
    scaling_factor = min(max_width / w, max_height / h)
    new_size = (int(w * scaling_factor), int(h * scaling_factor))
    return cv2.resize(image, new_size, interpolation=cv2.INTER_AREA)

@app.post("/upload/")
async def upload_book(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        logger.debug("File contents read successfully")

        # Save uploaded image
        uploaded_image_path = os.path.join(uploads_dir, file.filename)
        with open(uploaded_image_path, 'wb') as f:
            f.write(contents)

        # Read image with OpenCV
        img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Perform detection
        results = model(img_rgb)

        # Convert results to numpy array
        results_np = results.pandas().xyxy[0].to_numpy()

        cropped_dir = "uploads/cropped_books"
        if not os.path.exists(cropped_dir):
            os.makedirs(cropped_dir)

        book_count = 0
        extracted_texts = []

        for detection in results_np:
            x1, y1, x2, y2, confidence, class_id, class_name = detection

            if class_name == 'book':
                book_img = img_rgb[int(y1):int(y2), int(x1):int(x2)]
                book_img = resize_image(book_img)  # Resize the image
                book_img_path = os.path.join(cropped_dir, f"book_{book_count}.jpg")
                book_img_bgr = cv2.cvtColor(book_img, cv2.COLOR_RGB2BGR)
                cv2.imwrite(book_img_path, book_img_bgr)

                success, encoded_image = cv2.imencode('.jpg', book_img_bgr)
                content = encoded_image.tobytes()
                image = vision.Image(content=content)
                response = vision_client.text_detection(image=image)
                texts = response.text_annotations
                if texts:
                    text = texts[0].description
                    extracted_texts.append({
                        "text": text,
                        "image_path": book_img_path,
                        "coordinates": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}  # Include coordinates
                    })

                book_count += 1

        logger.debug(f"Extracted texts: {extracted_texts}")

        return {"extracted_texts": extracted_texts}
    except Exception as e:
        logger.error("Error processing file: %s", e)
        logger.error(traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})
'''
@app.get("/books/search_book/{query}")
async def search_book(query: str):
    logger.debug(f"Searching for book with query: {query}")
    try:
        async with aiohttp.ClientSession() as session:
            url = f"http://openlibrary.org/search.json?q={quote(query)}"
            async with session.get(url) as response:
                logger.debug(f"Response status: {response.status}")
                if response.status == 200:
                    data = await response.json()
                    logger.debug(f"Response data: {data}")
                    books = [
                        {
                            "title": doc.get("title"),
                            "author": ", ".join([author for author in doc.get("author_name", [])]),
                            "publish_year": doc.get("first_publish_year"),
                            "score": doc.get("score", None)  # Assuming score is available
                        }
                        for doc in data.get("docs", [])
                    ]
                    logger.debug(f"Books found: {books}")
                    return {"books": books}
                else:
                    raise HTTPException(status_code=response.status, detail="Error fetching book data")
    except Exception as e:
        logger.error("Error searching for book: %s", e)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
        

'''

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
