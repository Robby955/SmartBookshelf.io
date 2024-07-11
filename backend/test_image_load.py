import torch
import cv2
import numpy as np
from google.cloud import vision
from PIL import Image, ImageDraw, ImageFont
import os
import re
import unidecode
from datetime import datetime

# Set the Google Application Credentials environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# Load the YOLOv5 model, ensuring it uses the GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.hub.load('ultralytics/yolov5', 'yolov5s').to(device)

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()


def non_max_suppression_fast(boxes, overlapThresh=0.3):
    if len(boxes) == 0:
        return []

    if boxes.dtype.kind == "i":
        boxes = boxes.astype("float")

    pick = []
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]

    area = (x2 - x1 + 1) * (y2 - y1 + 1)
    idxs = np.argsort(y2)

    while len(idxs) > 0:
        last = len(idxs) - 1
        i = idxs[last]
        pick.append(i)

        xx1 = np.maximum(x1[i], x1[idxs[:last]])
        yy1 = np.maximum(y1[i], y1[idxs[:last]])
        xx2 = np.minimum(x2[i], x2[idxs[:last]])
        yy2 = np.minimum(y2[i], y2[idxs[:last]])

        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)

        overlap = (w * h) / area[idxs[:last]]

        idxs = np.delete(idxs, np.concatenate(([last], np.where(overlap > overlapThresh)[0])))

    return boxes[pick].astype("int")


def detect_books(image_path, save_path='detected_books.jpg', nms_thresh=0.3, conf_thresh=0.3):
    print(f"Processing image: {image_path}")
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Perform detection
    results = model(img_rgb)
    results_np = results.pandas().xyxy[0].to_numpy()

    # Filter results by confidence threshold
    filtered_results = [detection for detection in results_np if detection[4] >= conf_thresh]
    print(f"Number of detections before NMS: {len(filtered_results)}")
    print(f"Detections: {filtered_results}")

    # Apply Non-Maximum Suppression
    boxes = np.array([[int(x1), int(y1), int(x2), int(y2)] for x1, y1, x2, y2, conf, cls, name in filtered_results if
                      name == 'book'])
    nms_boxes = non_max_suppression_fast(boxes, nms_thresh)
    print(f"Number of detections after NMS: {len(nms_boxes)}")
    print(f"NMS Results: {nms_boxes}")

    cropped_dir = "cropped_books"
    if not os.path.exists(cropped_dir):
        os.makedirs(cropped_dir)

    book_count = 0
    extracted_texts = []

    for (x1, y1, x2, y2) in nms_boxes:
        filtered_detections = [detection for detection in filtered_results if detection[6] == 'book' and (
        int(detection[0]), int(detection[1]), int(detection[2]), int(detection[3])) == (x1, y1, x2, y2)]

        if not filtered_detections:
            continue

        detection = filtered_detections[0]
        confidence = detection[4]

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
                "image_path": f"cropped_books/book_{book_count + 1}.jpg",
                "confidence": confidence,
                "coordinates": (x1, y1, x2, y2)
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
        else:
            extracted_texts.append({
                "text": "No text detected",
                "image_path": f"cropped_books/book_{book_count + 1}.jpg",
                "confidence": confidence,
                "coordinates": (x1, y1, x2, y2)
            })
        book_count += 1

    # Draw bounding boxes on the original image
    for text in extracted_texts:
        x1, y1, x2, y2 = text['coordinates']
        cv2.rectangle(img_rgb, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(img_rgb, f"Book {text['confidence']:.2f}", (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (0, 255, 0), 2)

    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(save_path, img_bgr)

    # Create a report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = f"report_{timestamp}.txt"
    with open(report_path, 'w', encoding='utf-8') as report_file:
        report_file.write(f"Detection Report - {timestamp}\n")
        report_file.write(f"Total Books Detected: {book_count}\n\n")
        report_file.write("Details of Each Detected Book:\n\n")
        for text in extracted_texts:
            report_file.write(f"Confidence: {text['confidence']:.2f}\n")
            report_file.write(f"Extracted Text:\n{text['text']}\n")
            report_file.write(f"Image Path: {text['image_path']}\n")
            report_file.write(f"Coordinates: {text['coordinates']}\n\n")
        report_file.write("End of Report\n")

    return extracted_texts


def hyperparameter_search(images_info, conf_thresh_range, nms_thresh_range):
    best_params = {}
    best_diffs = {}

    for image_name, expected_count in images_info.items():
        best_diff = float('inf')
        best_conf_thresh = None
        best_nms_thresh = None

        image_path = os.path.join("images", image_name)

        for conf_thresh in conf_thresh_range:
            for nms_thresh in nms_thresh_range:
                print(f"\nTesting parameters: conf_thresh={conf_thresh}, nms_thresh={nms_thresh}")

                try:
                    extracted_texts = detect_books(image_path, conf_thresh=conf_thresh, nms_thresh=nms_thresh)
                    detected_count = len(extracted_texts)
                    diff = abs(detected_count - expected_count)

                    if diff < best_diff:
                        best_diff = diff
                        best_conf_thresh = conf_thresh
                        best_nms_thresh = nms_thresh

                    print(f"Detected {detected_count} books, expected {expected_count}, difference: {diff}")

                except Exception as e:
                    print(f"Error processing {image_name} with conf_thresh={conf_thresh}, nms_thresh={nms_thresh}: {e}")

        best_params[image_name] = {
            'conf_thresh': best_conf_thresh,
            'nms_thresh': best_nms_thresh,
            'difference': best_diff
        }
        best_diffs[image_name] = best_diff

        print(
            f"Best parameters for image {image_name}: ConfThresh - {best_conf_thresh}, NMSThresh - {best_nms_thresh}, Difference - {best_diff}")

    return best_params, best_diffs


# Define the images and their expected book counts
images_info = {
    'IMG_6484.jpg': 27,
    'IMG_6400.jpg': 9,
    'IMG_6335.jpg': 5,
    'IMG_6404.jpeg': 4,
    'IMG_6496.jpeg': 7,
    'IMG_6497.jpeg': 24,
    'IMG_6321.jpeg': 14,
    'IMG_6495.jpeg': 9,
    'IMG_6498.jpeg': 33,
    'IMG_6499.jpeg': 51,
    'IMG_6512.jpeg':7,
    'IMG_6507.jpeg':13,
    'IMG_6511.jpeg':5,
    'IMG_6510:jpeg':10

}

# Define the range for hyperparameters
conf_thresh_range = np.arange(0.1, 0.9, 0.05)
nms_thresh_range = np.arange(0.1, 0.9, 0.05)

# Perform the hyperparameter search
best_params, best_diffs = hyperparameter_search(images_info, conf_thresh_range, nms_thresh_range)

# Output the best parameters for each image
for image_name, params in best_params.items():
    print(f"Best parameters for {image_name}: {params}")
