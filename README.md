# ShelfValue.io

ShelfValue.io is an innovative application designed to automate the process of cataloging books from images of bookshelves. Utilizing state-of-the-art machine learning models for object detection and OCR (Optical Character Recognition), SmartShelf.io identifies books, extracts text from their spines or covers, and retrieves detailed information about each book from an external book database.

## Features

1. **Book Detection**: Uses the YOLOv5 object detection model to identify and locate books within an image of a bookshelf.
2. **Text Extraction**: Employs Google Cloud Vision API to perform OCR on the detected book regions, extracting relevant text such as titles and authors.
3. **Book Information Retrieval**: Queries an external book API using the extracted text to fetch detailed book information, including title, author, and publication year.
4. **Visualization**: Displays the original image with bounding boxes around detected books, along with the extracted text and book information.
5. **Cropped Images**: Saves cropped images of detected books for further processing or verification.

## Installation

### Prerequisites

- Python 3.12
- Google Cloud Vision API credentials
- MongoDB
- [Tesseract-OCR](https://github.com/tesseract-ocr/tesseract)

### Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/SmartShelf.io.git
    cd SmartShelf.io
    ```

2. **Create a virtual environment**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up Google Cloud Vision API**:
    - Download your `credentials.json` file from Google Cloud Console.
    - Set the environment variable for Google Application Credentials:
        ```bash
        export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
        # On Windows use `set GOOGLE_APPLICATION_CREDENTIALS=path\to\your\credentials.json`
        ```

5. **Install Tesseract-OCR**:
    - Download and install Tesseract-OCR from [here](https://github.com/tesseract-ocr/tesseract).
    - Add Tesseract-OCR to your system PATH.

## Usage

### Detect Books and Extract Information

1. **Run the script**:
    ```bash
    python backend/book_bounds.py
    ```

2. **Upload an image of a bookshelf**:
    - The script will detect books, save cropped images of each book, and extract text from these images.

3. **View results**:
    - The original image with bounding boxes around detected books will be displayed.
    - Cropped images and extracted text will be saved and printed in the console.
    - The script will query the book API with the extracted text and print the top 3 best matches for each detected book.

## Example

**Example image of a bookshelf:**

![Detected Books](my-app/public/examplemain.jpg)


## Deployment

SmartShelf.io is designed to be deployed on Google Cloud using various Google Cloud services for seamless scalability and integration. The application uses:
- **Google Cloud Run** for serverless deployment of the application.
- **Google Cloud Vision API** for OCR capabilities.
- **MongoDB Atlas** for cloud database services.

### Deployment Steps

1. **Build the Docker image**:
    ```bash
    docker build -t smartshelf .
    ```

2. **Deploy to Google Cloud Run**:
    ```bash
    gcloud run deploy smartshelf --image gcr.io/your-project-id/smartshelf --platform managed --region your-region --allow-unauthenticated
    ```

3. **Set environment variables** for Google Cloud Vision API credentials and MongoDB URI in Google Cloud Run.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

