import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
from google.cloud import vision
from PIL import Image, ImageDraw, ImageFont
import os
import re
import aiohttp
import asyncio
from fuzzywuzzy import fuzz, process
import unidecode

# Set the Google Application Credentials environment variable
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

def clean_text(text):
    """Clean the extracted text to remove unnecessary words or characters, but keep commas and replace dashes and specific symbols with spaces."""
    text = unidecode.unidecode(text)  # Convert characters with diacritics to their ASCII equivalents
    return text

def extract_title_and_author(text):
    """Extract potential book titles and author names from the text."""
    lines = text.split('\n')
    title_keywords = []
    author_keywords = []

    for line in lines:
        line = line.strip()
        if ':' in line:
            parts = line.split(':')
            if len(parts) > 1:
                title_keywords.append(parts[0].strip())
                title_keywords.append(parts[1].strip())
        elif ',' in line or '&' in line:
            author_keywords.append(line)
        elif len(line.split()) >= 2:
            title_keywords.append(line)

    # Handle case where a word contains an apostrophe (e.g., "O'Reilly")
    for line in lines:
        if re.search(r"\b\w+'\w+\b", line):
            parts = line.split()
            if len(parts) > 1:
                author_keywords.append(parts[-2])  # The word before the word with an apostrophe
                # Remove the word with apostrophe and the preceding word from title keywords
                title_part = ' '.join(parts[:-2]).strip()
                if title_part:
                    title_keywords = [kw for kw in title_keywords if kw != line.strip()]  # Remove the original line
                    title_keywords.append(title_part)

    # Handle case where a name precedes "O'Reilly" or any trademark symbol
    for line in lines:
        if "O'Reilly" in line or re.search(r'[®©™]', line):
            parts = line.split()
            if len(parts) > 1:
                author_keywords.append(parts[-2])

    # Further clean the author keywords to split by commas
    cleaned_author_keywords = []
    for author in author_keywords:
        cleaned_author_keywords.extend([a.strip() for a in re.split(r'[,&]', author) if a.strip()])

    # Deduplicate author keywords and adjust title keywords accordingly
    unique_author_keywords = set()
    for author in cleaned_author_keywords:
        if author in unique_author_keywords:
            for keyword in title_keywords:
                if author in keyword:
                    title_keywords = [kw for kw in title_keywords if kw != keyword]
                    title_part = keyword.replace(author, '').strip()
                    if title_part:
                        title_keywords.append(title_part)
        else:
            unique_author_keywords.add(author)

    cleaned_author_keywords = list(unique_author_keywords)

    return title_keywords, cleaned_author_keywords

async def search_book(session, keyword):
    """Search for book information using a keyword."""
    search_url = f"http://localhost:8000/books/search_book/{keyword}"
    try:
        async with session.get(search_url) as book_response:
            print(f"Searching for keyword: {keyword} - Response: {book_response.status}")
            if book_response.status == 200:
                data = await book_response.json()
                return data.get("books", [])
    except Exception as e:
        print(f"Error during book search for keyword: {keyword} - {str(e)}")
    return []

async def fetch_all_books(keywords):
    async with aiohttp.ClientSession() as session:
        tasks = [search_book(session, keyword) for keyword in keywords]
        results = await asyncio.gather(*tasks)
        return [book for result in results for book in result]

def fuzzy_match_search(text, candidates, threshold=80):
    """Perform fuzzy matching on the text against a list of candidates."""
    matches = process.extractBests(text, candidates, scorer=fuzz.ratio, score_cutoff=threshold)
    return matches

def find_best_match(title, authors, book_data):
    """Find the best matching book from the book data based on the extracted text."""
    combined_scores = []

    for book in book_data:
        title_score = fuzz.ratio(title, book.get('title', ''))
        author_score = max([fuzz.ratio(author, book.get('author', '')) for author in authors], default=0)
        combined_score = (title_score + author_score) / 2
        combined_scores.append((book, combined_score))

    # Sort by combined score and return top matches
    combined_scores.sort(key=lambda x: x[1], reverse=True)
    top_matches = combined_scores[:3]
    return top_matches

def test_extraction_and_search(extracted_text):
    print(f"Original Extracted Text:\n{extracted_text}\n")

    cleaned_text = clean_text(extracted_text)
    title_keywords, author_keywords = extract_title_and_author(cleaned_text)
    print(f"Extracted Title Keywords:\n{title_keywords}\n")
    print(f"Extracted Author Keywords:\n{author_keywords}\n")

    keywords = title_keywords + author_keywords

    book_data = asyncio.run(fetch_all_books(keywords))

    if book_data:
        best_matches = find_best_match(' '.join(title_keywords), author_keywords, book_data)
        if best_matches:
            print(f"Top Matches Found:")
            for book, score in best_matches:
                print(f"{book} with score {score}\n")
        else:
            print("No suitable match found.\n")
    else:
        print("No books found.\n")

def detect_books(image_path, save_path='detected_books.jpg'):
    # Load the image
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Perform detection
    results = model(img_rgb)

    # Convert results to numpy array
    results_np = results.pandas().xyxy[0].to_numpy()

    print("Detections:")

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
            print(f"Cropped book image saved to {book_img_path}")

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

            else:
                print("No text detected")

            book_count += 1

    return extracted_texts

# Test the function
extracted_texts = detect_books('IMG_6404.jpg')

for text in extracted_texts:
    test_extraction_and_search(text)
