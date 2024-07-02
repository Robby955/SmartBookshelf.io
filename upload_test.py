import requests

url = "http://localhost:8000/upload/"
file_path = "backend/IMG_6404.jpeg"

with open(file_path, 'rb') as file:
    files = {'file': file}
    response = requests.post(url, files=files)

print(response.json())
