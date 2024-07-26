import requests
import json
import urllib.parse

def test_get_signed_url(file_name):
    url = 'http://localhost:8000/get-signed-url'
    params = {'fileName': urllib.parse.quote(file_name)}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        if 'url' in data:
            print(f"Signed URL: {data['url']}")
        else:
            print(f"Error: {data.get('error', 'Unknown error')}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except json.JSONDecodeError:
        print("Failed to parse JSON response")

if __name__ == "__main__":
    test_get_signed_url(
        'cropped_books/book_1055.2667236328125_102.02796936035156_1620.8206787109375_3737.898681640625.jpg')
