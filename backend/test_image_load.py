import torch
import cv2
import numpy as np
from google.cloud import vision
from PIL import Image, ImageDraw, ImageFont
import os
import re
import unidecode

# Set the Google Application Credentials environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

def clean_text(text):
    text = re.sub(r'[•&]', ',', text)
    text = re.sub(r'[^A-Za-z0-9,\s\'-]', '', text)
    text = text.replace('-', ' ')
    text = unidecode.unidecode(text)
    return text

def detect_books(image_path, save_path='detected_books.jpg'):
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    results = model(img_rgb)
    results_np = results.pandas().xyxy[0].to_numpy()

    cropped_dir = "cropped_books"
    if not os.path.exists(cropped_dir):
        os.makedirs(cropped_dir)

    book_count = 0
    extracted_texts = []

    for detection in results_np:
        x1, y1, x2, y2, confidence, class_id, class_name = detection

        if class_name == 'book':
            book_img = img_rgb[int(y1):int(y2), int(x1):int(x2)]
            book_img_path = os.path.join(cropped_dir, f"book_{book_count + 1}.jpg")
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
                    "image_path": f"cropped_books/book_{book_count + 1}.jpg"
                })

                text_img = Image.new('RGB', (book_img.shape[1], 100), color=(255, 255, 255))
                draw = ImageDraw.Draw(text_img)
                font = ImageFont.truetype("arial.ttf", 15)
                draw.text((10, 10), text, fill=(0, 0, 0), font=font)

                combined_img = Image.new('RGB', (book_img.shape[1], book_img.shape[0] + 100))
                combined_img.paste(Image.fromarray(book_img), (0, 0))
                combined_img.paste(text_img, (0, book_img.shape[0]))

                combined_img_path = os.path.join(cropped_dir, f"combined_{book_count + 1}.jpg")
                combined_img.save(combined_img_path)
            book_count += 1

    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(save_path, img_bgr)

    return extracted_texts

# Test the function
extracted_texts = detect_books('IMG_6335.jpg')

for text in extracted_texts:
    print(f"Extracted Text:\n{text['text']}\n")
    print(f"Image Path: {text['image_path']}\n")
