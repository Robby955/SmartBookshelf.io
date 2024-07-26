import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
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
    """Clean the extracted text to remove unnecessary words or characters, but keep commas and replace dashes and specific symbols with spaces."""
    text = re.sub(r'[•&]', ',', text)
    text = re.sub(r'[^A-Za-z0-9,\s\'-]', '', text)
    text = text.replace('-', ' ')
    text = unidecode.unidecode(text)  # Convert characters with diacritics to their ASCII equivalents
    return text



def detect_books(image_path, save_path='detected_books.jpg'):
    # Load the image
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Perform detection
    results = model(img_rgb)

    # Convert results to numpy array
    results_np = results.pandas().xyxy[0].to_numpy()



    # Create a directory for saving cropped images
    cropped_dir = "cropped_books"
    if not os.path.exists(cropped_dir):
        os.makedirs(cropped_dir)

    book_count = 0
    extracted_texts = []

    # Iterate over the detections and draw bounding boxes
    for detection in results_np:
        x1, y1, x2, y2, confidence, class_id, class_name = detection

        if class_name == 'book':  # You might need to change this based on the detected classes
            print(f"Detected {class_name} with confidence {confidence:.2f}")

            # Draw bounding box
            cv2.rectangle(img_rgb, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(img_rgb, f'{class_name} {confidence:.2f}', (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX,
                        0.5, (0, 255, 0), 2)

            # Crop the detected book region
            book_img = img_rgb[int(y1):int(y2), int(x1):int(x2)]

            # Save the cropped image
            book_img_path = os.path.join(cropped_dir, f"book_{book_count + 1}.jpg")  # Start counting from 1
            book_img_bgr = cv2.cvtColor(book_img, cv2.COLOR_RGB2BGR)
            cv2.imwrite(book_img_path, book_img_bgr)


            # Perform OCR using Google Cloud Vision
            success, encoded_image = cv2.imencode('.jpg', book_img_bgr)
            content = encoded_image.tobytes()
            image = vision.Image(content=content)
            response = vision_client.text_detection(image=image)
            texts = response.text_annotations
            if texts:
                text = texts[0].description
                print(f"Extracted Text: {text}")
                extracted_texts.append(text)

                # Create a blank white image to display text
                text_img = Image.new('RGB', (book_img.shape[1], 100), color=(255, 255, 255))
                draw = ImageDraw.Draw(text_img)
                font = ImageFont.truetype("arial.ttf", 15)  # Adjust font size as needed
                draw.text((10, 10), text, fill=(0, 0, 0), font=font)

                # Concatenate the cropped book image and the text image
                combined_img = Image.new('RGB', (book_img.shape[1], book_img.shape[0] + 100))
                combined_img.paste(Image.fromarray(book_img), (0, 0))
                combined_img.paste(text_img, (0, book_img.shape[0]))

                # Save the combined image
                combined_img_path = os.path.join(cropped_dir, f"combined_{book_count + 1}.jpg")  # Start counting from 1
                combined_img.save(combined_img_path)

            else:
                print("No text detected")

            book_count += 1

    # Show the image with bounding boxes
    plt.figure(figsize=(12, 8))
    plt.imshow(img_rgb)
    plt.axis('off')
    plt.show()

    # Save the image with bounding boxes
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(save_path, img_bgr)

    return extracted_texts


# Test the function
extracted_texts = detect_books('test_images/IMG_6464.jpeg')


