import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { doc, collection, runTransaction } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import MultiCrop from '../components/MultiCrop';
import { db, auth } from '../lib/firebaseClient';


export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [gptSuggestions, setGptSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [bookCount, setBookCount] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [correctedBookCount, setCorrectedBookCount] = useState(null);
  const [analyzingText, setAnalyzingText] = useState('');
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const bookRefs = useRef([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Clear state on component mount (i.e., on refresh)
    setSelectedFiles([]);
    setUploadedImages([]);
    setCroppedImages([]);
    setExtractedTexts([]);
    setError('');
    setBookCount(null);
    setIsAnalyzing(false);
    setUploadAttempted(false);
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      updateAnalyzingText();
    } else {
      setAnalyzingText('');
    }
  }, [isAnalyzing]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setUploadedImages(prevImages => [...prevImages, ...files.map(file => URL.createObjectURL(file))]);
    setError(''); // Clear any previous error
    console.log("Files selected:", files);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...selectedFiles];
    const newImages = [...uploadedImages];
    newFiles.splice(index, 1);
    newImages.splice(index, 1);
    setSelectedFiles(newFiles);
    setUploadedImages(newImages);
  };

  const handleRemoveCroppedImage = (index) => {
    const newCroppedImages = [...croppedImages];
    newCroppedImages.splice(index, 1);
    setCroppedImages(newCroppedImages);
  };

  const handleCropComplete = (blob, dataUrl) => {
    setCroppedImages(prev => [...prev, { blob, dataUrl }]);
  };

  const updateAnalyzingText = () => {
    const texts = ['Analyzing...', 'Detecting Books...', 'Extracting Texts...', 'Loading Summary...'];
    let index = 0;

    const interval = setInterval(() => {
      if (isAnalyzing) {
        setAnalyzingText(texts[index]);
        index = (index + 1) % texts.length;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  };

  const getSignedUrl = async (fileName) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${backendUrl}/get-signed-url?fileName=${encodeURIComponent(fileName)}`);
      const data = await response.json();
      if (response.ok) {
        return data.url;
      } else {
        throw new Error(data.error || 'Failed to get signed URL');
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      setError('Error getting signed URL, please try again.');
      return null;
    }
  };

  const fetchGptSuggestions = async (texts) => {
    try {
      const response = await fetch('/api/gpt-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texts }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GPT suggestions');
      }

      const data = await response.json();
      setGptSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error fetching GPT suggestions:', error);
      setError('Error fetching GPT suggestions, please try again.');
    }
  };

  const handleUpload = async () => {
    setUploadAttempted(true); // Set uploadAttempted to true when the upload button is clicked

    const imagesToUpload = cropMode ? croppedImages.map(image => image.blob) : selectedFiles;

    if (imagesToUpload.length === 0) {
      setError('Please upload at least one photo first');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzingText('Analyzing...');
    updateAnalyzingText(); // Start updating the text

    const formData = new FormData();
    imagesToUpload.forEach(file => {
      formData.append('files', file);
    });

    // Only append userID if user is logged in
    if (user) {
      formData.append('userID', user.uid);
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl); // Debugging line

    try {
      const response = await fetch(`${backendUrl}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      if (result.extracted_texts) {
        setIsAnalyzing(false); // Stop updating the text
        setAnalyzingText(''); // Reset the analyzing text
        const sortedBooks = await Promise.all(
          result.extracted_texts.sort((a, b) => a.coordinates.x1 - b.coordinates.x1).map(async (book) => {
            const signedUrl = await getSignedUrl(book.image_url);
            return { ...book, image_url: signedUrl };
          })
        );

        setExtractedTexts(sortedBooks);
        setBookCount(sortedBooks.length);
        setCorrectedBookCount(sortedBooks.length);
        bookRefs.current = sortedBooks.map((_, i) => bookRefs.current[i] || React.createRef());

        // Fetch GPT suggestions
        const textsToAnalyze = sortedBooks.map(book => book.text);
        await fetchGptSuggestions(textsToAnalyze);

        // Only update Firestore if the user is logged in
        if (user) {
          // Update Firestore with new books and increment total uploads using a transaction
          await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, 'users', user.uid);

            // Get the current total_uploads value
            const userDoc = await transaction.get(userDocRef);
            const newTotalUploads = (userDoc.data().total_uploads || 0) + sortedBooks.length;

            sortedBooks.forEach((book) => {
              const newBookRef = doc(collection(db, 'uploads'));
              transaction.set(newBookRef, { ...book, userId: user.uid });
            });

            transaction.update(userDocRef, { total_uploads: newTotalUploads });
          });

          console.log('Firestore updated successfully');
        }
      } else {
        console.error('No extracted texts found in the response:', result);
        setError('No extracted texts found.');
        setBookCount(null);
        setIsAnalyzing(false); // Ensure to stop analyzing if no texts are found
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file, please try again.');
      setBookCount(null);
      setIsAnalyzing(false); // Ensure to stop analyzing on error
    }
  };

  const handleRefresh = () => {
    // Clear the file input element
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';

    // Revoke object URLs to free up memory
    uploadedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
    croppedImages.forEach((image) => URL.revokeObjectURL(image.dataUrl));

    // Reset state variables
    setSelectedFiles([]);
    setUploadedImages([]);
    setCroppedImages([]);
    setExtractedTexts([]);
    setGptSuggestions([]);
    setError('');
    setBookCount(null);
    setCorrectedBookCount(null);
    setUploadAttempted(false);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setIsAnalyzing(false);
    setAnalyzingText('');
    setCropMode(false); // Reset crop mode

    // Clear user information but keep Firestore persistence
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  };

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12" style={{ backgroundImage: "url('background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed", backgroundPosition: "center", color: "#ffffff" }}>
      <Head>
        <title>SmartBookshelf.io</title>
        <meta name="description" content="Upload a book image and extract text" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-white mb-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">Welcome to SmartBookshelf.io!</h2>
          <p className="mb-4 text-lg">This tool helps you to catalog your bookshelf by extracting text from book spines. Follow the steps below to get started:</p>
          <ol className="list-decimal list-inside text-left text-lg">
            <li className="mb-2">Click the &quot;Choose File&quot; button below.</li>
            <li className="mb-2">Select one or more photos of your bookshelves (one photo per shelf) or take new ones.</li>
            {cropMode && <li className="mb-2">Crop the areas of interest and click &quot;Add Crop&quot;. Repeat if necessary.</li>}
            <li className="mb-2">Click &quot;Upload&quot; to analyze the images and extract the text from the spine.</li>
          </ol>
        </div>

        <div className="w-full mb-6">
          <div className="flex items-center mb-4">
            <label className="text-white mr-2">Crop Mode</label>
            <input type="checkbox" checked={cropMode} onChange={() => setCropMode(!cropMode)} />
          </div>

            <p className="mb-4 text-lg text-white">Reminder: Each image should only contain one level of a shelf. If you want to add more, upload additional images, or use crop mode.</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {selectedFiles.length > 0 && (
            <div className="text-center text-lg text-white mb-4">
              <p>Selected files: {selectedFiles.length}</p>
            </div>
          )}
          {uploadedImages.length > 0 && cropMode && (
            <div className="w-full mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Crop your images</h2>
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative w-full mb-4">
                  <MultiCrop image={image} onCropComplete={handleCropComplete} />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    style={{ width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center', fontSize: '14px' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploadedImages.length > 0 && !cropMode && (
            <div className="w-full mb-4">
              <h2 className="text-xl font-bold text-white mb-4">Uploaded Images</h2>
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative w-full mb-4">
                  <div className="image-container">
                    <Image src={image} alt={`Uploaded ${index + 1}`} layout="responsive" width={500} height={300} className="w-full max-h-64 object-contain rounded-lg" />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    style={{ width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center', fontSize: '14px' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleUpload}
            className={`btn btn-primary w-full ${isAnalyzing ? 'btn-disabled' : ''}`}
            disabled={isAnalyzing}
          >
              { isAnalyzing ? analyzingText : (uploadAttempted ? 'Upload again' : 'Upload') }
          </button>
        </div>

        {uploadAttempted && (
          <button
            onClick={handleRefresh}
            className="btn w-auto mb-4"
            style={{ backgroundColor: '#1E90FF', color: '#ffffff' }}
          >
            Start Over
          </button>
        )}

        {isAnalyzing && (
          <div className="w-full text-center text-lg font-bold text-white mb-4">
            {analyzingText}
          </div>
        )}

        {bookCount !== null && (
          <div className="w-full text-center text-xl font-bold text-white mb-4">
            <div className="flex items-center justify-center">
              <label className="mr-2"># of Books Detected:</label>
              <span className="font-semibold">{bookCount}</span>
            </div>
            <div className="mt-2">
              <label className="mr-2">Extracted Texts:</label>
              <select
                className="text-gray-900 rounded p-1 w-full max-w-md"
                value={correctedBookCount !== null ? correctedBookCount : ''}
                onChange={(e) => setCorrectedBookCount(e.target.value)}
              >
                {extractedTexts.map((text, index) => (
                  <option key={index} value={index}>
                    {text.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mr-2">AI Suggestions:</label>
              <select
                className="text-gray-900 rounded p-1 w-full max-w-md"
                value={correctedBookCount !== null ? correctedBookCount : ''}
                onChange={(e) => setCorrectedBookCount(e.target.value)}
              >
                {gptSuggestions.map((suggestion, index) => (
                  <option key={index} value={index}>
                    {suggestion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {bookCount !== null && (
          <button
            onClick={() => setShowFeedback(true)}
            className="btn btn-secondary w-auto mb-4"
            style={{ backgroundColor: 'red', color: '#ffffff' }}
          >
            Feedback
          </button>
        )}

        {showFeedback && (
          <div className="w-full text-center text-xl font-bold text-white mb-4">
            <label>
              Correct # of Books Detected:
              <input
                type="number"
                value={correctedBookCount}
                onChange={(e) => setCorrectedBookCount(e.target.value)}
                className="ml-2 text-gray-900 rounded p-1"
              />
            </label>
            <button
              onClick={handleFeedbackSubmit}
              className="btn btn-primary w-auto mt-2"
              style={{ backgroundColor: 'green', color: '#ffffff' }}
            >
              Submit Feedback
            </button>
          </div>
        )}

        {feedbackSubmitted && (
          <div className="w-full text-center text-xl font-bold text-white mb-4">
            <p>Thanks for the feedback!</p>
          </div>
        )}

        {extractedTexts.length > 0 && (
          <div className="w-full mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Extracted Texts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extractedTexts.map((item, index) => (
                <div key={index} className="card shadow-md rounded-lg p-4" style={{ background: 'linear-gradient(to bottom, #f8fafc, #e0e7ff)' }} ref={el => bookRefs.current[index] = el}>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">Extracted Text:</h2>
                  <p className="text-gray-700">{item.text || 'No text detected'}</p>
                  <div className="image-container">
                    <Image
                      src={item.image_url}
                      alt={`Book ${index + 1}`}
                      layout="responsive"
                      width={500}
                      height={300}
                      className="mb-4 rounded-lg w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Suggestion:</h3>
                  <p className="text-gray-700">{gptSuggestions[index] || 'No suggestion'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {cropMode && croppedImages.length > 0 && (
          <div className="w-full mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Cropped Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {croppedImages.map((image, index) => (
                <div key={index} className="relative card shadow-md rounded-lg p-4" style={{ background: 'linear-gradient(to bottom, #f8fafc, #e0e7ff)' }}>
                  <div className="image-container">
                    <Image
                      src={image.dataUrl}
                      alt={`Cropped ${index + 1}`}
                      layout="responsive"
                      width={500}
                      height={300}
                      className="mb-4 rounded-lg w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveCroppedImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    style={{ width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center', fontSize: '14px' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
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
