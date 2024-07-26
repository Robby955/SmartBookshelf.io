import csv
from io import StringIO
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def clean_text(text):
    """Clean text by replacing newlines and multiple spaces with a single space."""
    text = ' '.join(text.split())  # Replace multiple spaces and newlines with a single space
    return text


def export_csv(extracted_texts, file_path='test_books.csv'):
    try:
        # Create a CSV file in memory
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Text', 'Image URL'])

        for book in extracted_texts:
            text = clean_text(book['text'])  # Clean the text
            writer.writerow([text, book['image_url']])

        output.seek(0)

        # Save to file
        with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
            csvfile.write(output.getvalue())

        logger.debug(f"CSV exported successfully to {file_path}")

    except Exception as e:
        logger.error("Error exporting CSV: %s", e)


if __name__ == "__main__":
    # Sample extracted texts for testing
    extracted_texts = [
        {
            "text": "DESIGN AND ANALYSIS OF\nMONTGOMERY\nEXPERIMENTS\nNINTH\nEDITION",
            "image_url": "http://example.com/book1.jpg"
        },
        {
            "text": "FOURTH EDITION\nHadoop:\nThe Definitive Guide\nWhite\nO'REILLY",
            "image_url": "http://example.com/book2.jpg"
        },
        {
            "text": "Designing Data-Intensive Kleppmann\nO'REILLY\nApplications",
            "image_url": "http://example.com/book3.jpg"
        }
    ]

    # Export the CSV
    export_csv(extracted_texts)
