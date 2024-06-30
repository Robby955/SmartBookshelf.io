import os
from google.cloud import vision
import io

# Set the environment variable for Google Application Credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'backend/credentials.json'

def detect_text_in_image(image_path):
    """Detects text in the file located in image_path."""
    client = vision.ImageAnnotatorClient()

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        raise Exception(f'{response.error.message}')

    if texts:
        print('Texts:')
        for text in texts:
            print(f'"{text.description}"')
    else:
        print('No text detected')

if __name__ == '__main__':
    # Path to the local image file
    image_path = 'frontend/images/IMG_6293.jpeg'
    detect_text_in_image(image_path)
