import csv
from io import StringIO
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from google.cloud import vision, storage
import logging
import traceback
import torch
import cv2
import numpy as np
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes and origins

# Initialize Google Cloud Storage client
storage_client = storage.Client()
bucket_name = 'my-book-images-detection'
bucket = storage_client.bucket(bucket_name)

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

def resize_image(image, max_width=400, max_height=600):
    """Resize an image while maintaining aspect ratio."""
    h, w = image.shape[:2]
    scaling_factor = min(max_width / w, max_height / h)
    new_size = (int(w * scaling_factor), int(h * scaling_factor))
    return cv2.resize(image, new_size, interpolation=cv2.INTER_AREA)

@app.route("/upload/", methods=["POST"])
def upload_book():
    try:
        file = request.files["file"]
        user_id = request.form.get('userID')  # Ensure userID is passed from frontend
        contents = file.read()
        logger.debug("File contents read successfully")

        # Save uploaded image to Google Cloud Storage
        blob = bucket.blob(file.filename)
        blob.upload_from_string(contents, content_type=file.content_type)
        uploaded_image_url = blob.public_url
        logger.debug(f"Image uploaded to {uploaded_image_url}")

        # Read image with OpenCV
        img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image")
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        logger.debug("Image read and converted to RGB")

        # Perform detection
        results = model(img_rgb)
        logger.debug("Detection performed")

        # Convert results to numpy array
        results_np = results.pandas().xyxy[0].to_numpy()
        logger.debug(f"Detection results: {results_np}")

        extracted_texts = []

        for detection in results_np:
            x1, y1, x2, y2, confidence, class_id, class_name = detection

            if class_name == 'book':
                book_img = img_rgb[int(y1):int(y2), int(x1):int(x2)]
                book_img = resize_image(book_img)  # Resize the image
                _, encoded_image = cv2.imencode('.jpg', book_img)
                content = encoded_image.tobytes()

                # Save cropped book image to Google Cloud Storage
                book_blob = bucket.blob(f"cropped_books/book_{x1}_{y1}_{x2}_{y2}.jpg")
                book_blob.upload_from_string(content, content_type='image/jpeg')
                book_img_url = book_blob.public_url
                logger.debug(f"Book image uploaded to {book_img_url}")

                image = vision.Image(content=content)
                response = vision_client.text_detection(image=image)
                texts = response.text_annotations
                if texts:
                    text = texts[0].description
                    extracted_texts.append({
                        "text": text,
                        "image_url": book_img_url,
                        "coordinates": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
                    })
                    logger.debug(f"Extracted text: {text}")

                    # Save to Firestore
                    doc_ref = db.collection('uploads').document()
                    doc_ref.set({
                        'imageURL': book_img_url,
                        'text': text,
                        'userId': user_id
                    })
                    logger.debug(f"Saved to Firestore: {text}")

        # Update total uploads in the user's document
        user_doc_ref = db.collection('users').document(user_id)
        user_doc_ref.update({
            'total_uploads': firestore.Increment(len(extracted_texts))
        })

        logger.debug(f"Extracted texts: {extracted_texts}")

        return jsonify({"extracted_texts": extracted_texts})
    except Exception as e:
        logger.error("Error processing file: %s", e)
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route("/export-csv", methods=["GET"])
def export_csv():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Fetch user books from Firestore
        books_ref = db.collection('uploads').where('userId', '==', user_id)
        docs = books_ref.stream()

        # Create a CSV file in memory
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Text', 'Image URL'])

        for doc in docs:
            book = doc.to_dict()
            writer.writerow([book['text'], book['imageURL']])

        output.seek(0)
        return send_file(output, mimetype='text/csv', attachment_filename='books.csv', as_attachment=True)
    except Exception as e:
        logger.error("Error exporting CSV: %s", e)
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the SmartBookshelf API"})

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
