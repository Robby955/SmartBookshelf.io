import requests
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/search_book/{title}")
async def search_book(title: str):
    url = f"https://openlibrary.org/search.json"
    params = {'title': title}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        books = [
            {
                "title": book.get("title"),
                "author": book.get("author_name", ["Unknown Author"])[0],
                "publish_year": book.get("first_publish_year", "Unknown Year")
            }
            for book in data.get("docs", [])
        ]
        return {"books": books}
    else:
        raise HTTPException(status_code=response.status_code, detail="Error fetching book details")
