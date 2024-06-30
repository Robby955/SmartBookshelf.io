import requests

def search_book(query):
    url = f'http://localhost:8000/books/search_book/{query}'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Failed to fetch book info: {response.status_code}')
        return None

if __name__ == '__main__':
    # Test with a well-known book title
    query = 'The Elements of Statistical Learning'
    result = search_book(query)
    if result:
        print(result)
    else:
        print('No book information found.')
