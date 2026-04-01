import requests
import os

url = os.environ.get('SMARTBOOKSHELF_UPLOAD_URL', 'http://localhost:8000/upload/')
file_path = "backend/test_images/IMG_6404.jpeg"

with open(file_path, 'rb') as file:
    files = {'file': file}
    response = requests.post(url, files=files)

print(response.json())
