import torch
import cv2
import numpy as np
import os
from google.cloud import vision
from datetime import datetime
from collections import defaultdict

# Set the Google Application Credentials environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

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


def split_image(image, tile_size=1024, overlap=0.1):
    h, w = image.shape[:2]
    step = int(tile_size * (1 - overlap))
    tiles = []

    for y in range(0, h, step):
        for x in range(0, w, step):
            x_end = min(x + tile_size, w)
            y_end = min(y + tile_size, h)
            tiles.append((x, y, x_end, y_end))

    return tiles


def detect_books_count(image_path, conf_thresh=0.3, nms_thresh=0.3, tile_size=1024, overlap=0.1):
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Split the image into tiles
    tiles = split_image(img_rgb, tile_size, overlap)
    detections = []

    for (x, y, x_end, y_end) in tiles:
        tile_img = img_rgb[y:y_end, x:x_end]
        results = model(tile_img)
        results_np = results.pandas().xyxy[0].to_numpy()

        for detection in results_np:
            x1, y1, x2, y2, conf, cls, name = detection
            if conf >= conf_thresh and name == 'book':
                detections.append([x1 + x, y1 + y, x2 + x, y2 + y, conf, cls, name])

    # Apply Non-Maximum Suppression
    boxes = np.array([[x1, y1, x2, y2] for x1, y1, x2, y2, conf, cls, name in detections])
    nms_boxes = non_max_suppression_fast(boxes, nms_thresh)

    return len(nms_boxes)


def evaluate_thresholds(image_paths, known_counts, conf_thresh_range, nms_thresh_range):
    results = defaultdict(dict)

    for conf_thresh in conf_thresh_range:
        for nms_thresh in nms_thresh_range:
            total_difference = 0
            for image_path, known_count in zip(image_paths, known_counts):
                detected_count = detect_books_count(image_path, conf_thresh, nms_thresh)
                total_difference += abs(detected_count - known_count)
            results[conf_thresh][nms_thresh] = total_difference

    return results


def find_optimal_thresholds(results):
    optimal_conf_thresh = None
    optimal_nms_thresh = None
    min_difference = float('inf')

    for conf_thresh, nms_results in results.items():
        for nms_thresh, total_difference in nms_results.items():
            if total_difference < min_difference:
                min_difference = total_difference
                optimal_conf_thresh = conf_thresh
                optimal_nms_thresh = nms_thresh

    return optimal_conf_thresh, optimal_nms_thresh, min_difference


image_paths = ['IMG_6484.jpg', 'IMG_6335.jpg', 'IMG_6404.jpeg', 'IMG_6485.jpeg']
known_counts = [27, 5, 4, 16]

conf_thresh_range = np.arange(0.1, 1.0, 0.1)
nms_thresh_range = np.arange(0.1, 1.0, 0.1)

results = evaluate_thresholds(image_paths, known_counts, conf_thresh_range, nms_thresh_range)
optimal_conf_thresh, optimal_nms_thresh, min_difference = find_optimal_thresholds(results)

print(f"Optimal Confidence Threshold: {optimal_conf_thresh}")
print(f"Optimal NMS Threshold: {optimal_nms_thresh}")
print(f"Minimum Total Difference: {min_difference}")
