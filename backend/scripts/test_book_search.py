import re
import requests
from fuzzywuzzy import fuzz, process


def clean_text(text):
    """Clean the extracted text to remove unnecessary words or characters."""
    text = re.sub(r'[^A-Za-z\s]', '', text)
    return text


def extract_keywords(text):
    """Extract potential book titles and author names from the text."""
    lines = text.split('\n')
    keywords = [line.strip() for line in lines if len(line.split()) > 2]
    return keywords


def search_book(title):
    """Search for book information using the title."""
    search_url = f"http://localhost:8000/books/search_book/{title}"
    try:
        book_response = requests.get(search_url)
        print(f"Searching for title: {title} - Response: {book_response.status_code}")
        if book_response.status_code == 200:
            data = book_response.json()
            return data["books"]
    except Exception as e:
        print(f"Error during book search for title: {title} - {str(e)}")
    return []


def fuzzy_match_search(text, candidates, threshold=80):
    """Perform fuzzy matching on the text against a list of candidates."""
    matches = process.extractBests(text, candidates, scorer=fuzz.ratio, score_cutoff=threshold)
    return matches


def find_best_match(extracted_text, book_data):
    """Find the best matching book from the book data based on the extracted text."""
    titles = [book['title'] for book in book_data]
    best_match = process.extractOne(extracted_text, titles, scorer=fuzz.ratio)
    if best_match:
        best_title, score = best_match
        for book in book_data:
            if book['title'] == best_title:
                return book, score
    return None, 0


def test_extraction_and_search(extracted_text):
    print(f"Original Extracted Text:\n{extracted_text}\n")

    cleaned_text = clean_text(extracted_text)
    keywords = extract_keywords(cleaned_text)
    print(f"Extracted Keywords:\n{keywords}\n")

    book_data = []
    for keyword in keywords:
        book_results = search_book(keyword)
        if book_results:
            book_data.extend(book_results)

    if not book_data:
        print("No exact matches found. Attempting fuzzy matching...")
        all_titles = [book["title"] for book in book_data]
        fuzzy_matches = fuzzy_match_search(cleaned_text, all_titles)
        print(f"Fuzzy Matches Found:\n{fuzzy_matches[:5]}")  # Print top 5 fuzzy matches
        book_data = [match[0] for match in fuzzy_matches[:5]]  # Use top 5 fuzzy matches

    if book_data:
        best_book, score = find_best_match(cleaned_text, book_data)
        if best_book:
            print(f"Best Match Found:\n{best_book} with score {score}\n")
        else:
            print("No suitable match found.\n")
    else:
        print("No books found.\n")


if __name__ == "__main__":
    extracted_texts = [
        "Hastie • Tibshirani • Friedman The Elements of Statistical Learning",
        "Springer Series in Statistics\nTrevor Hastie\nRobert Tibshirani\nJerome Friedman\nThe Elements of\nStatistical Learning\nData Mining, Inference, and Prediction\nSecond Edition\nSpringer"
    ]

    for text in extracted_texts:
        test_extraction_and_search(text)
