import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [error, setError] = useState('');
  const [bookCount, setBookCount] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);

  const bookRefs = useRef([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl); // Debugging line

    try {
      const response = await fetch(`${backendUrl}upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      if (result.extracted_texts) {
        const sortedBooks = result.extracted_texts.sort((a, b) => a.coordinates.x1 - b.coordinates.x1);
        setExtractedTexts(sortedBooks);
        setBookCount(sortedBooks.length);
        setBookInfo(null);
        bookRefs.current = sortedBooks.map((_, i) => bookRefs.current[i] || React.createRef());
      } else {
        console.error('No extracted texts found in the response:', result);
        setError('No extracted texts found.');
        setBookCount(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file, please try again.');
      setBookCount(null);
    }
  };

  const handleBookSelect = async (event) => {
    const selectedText = event.target.value;
    setSelectedBook(selectedText);
    console.log(`Selected book text: ${selectedText}`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}books/search_book/${encodeURIComponent(selectedText)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Book info:', data);
      setBookInfo(data.books.length > 0 ? data.books[0] : null);

      const index = extractedTexts.findIndex(item => item.text === selectedText);
      if (index !== -1 && bookRefs.current[index]) {
        bookRefs.current[index].scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching book info:', error);
      setError('Error fetching book info, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>SmartBookshelf.io</title>
        <meta name="description" content="Upload a book image and extract text" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">SmartBookshelf.io</h1>

        <div className="w-full mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {bookCount !== null && (
            <div className="w-full text-center text-xl font-bold white mb-4">
              # of Books Detected: {bookCount}
            </div>
          )}
          {extractedTexts.length > 0 && (
            <div className="w-full mb-4">
              <label htmlFor="books-dropdown" className="block mb-2 text-sm font-bold text-white">
                Select a Book Title:
              </label>
              <select
                id="books-dropdown"
                className="select select-bordered w-full"
                style={{ color: 'black' }} // Ensure the text is black
                onChange={handleBookSelect}
              >
                {extractedTexts.map((item, index) => (
                  <option key={index} value={item.text}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
          )}
          {uploadedImage && (
            <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden">
              <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
            </div>
          )}
          <button
            onClick={handleUpload}
            className="btn btn-primary w-full"
          >
            Upload
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {extractedTexts.map((item, index) => (
            <div key={index} className="card shadow-md rounded-lg p-4 bg-white" ref={el => bookRefs.current[index] = el}>
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Extracted Text:</h2>
              <p className="text-gray-700">{item.text || 'No text detected'}</p>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image_path}`}
                alt={`Book ${index + 1}`}
                className="mb-4 rounded-lg w-full h-auto max-h-64 object-contain"
              />
            </div>
          ))}
        </div>

        {bookInfo && (
          <div className="w-full mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Book Information</h2>
            <p><strong>Title:</strong> {bookInfo.title}</p>
            <p><strong>Author:</strong> {bookInfo.author}</p>
            <p><strong>Year:</strong> {bookInfo.publish_year}</p>
            <p><strong>Score:</strong> {bookInfo.score}</p>
          </div>
        )}

        {error && (
          <div className="w-full mt-8 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
