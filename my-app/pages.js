"use client";
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [extractedTexts, setExtractedTexts] = useState([]);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadedImage(URL.createObjectURL(event.target.files[0]));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Backend response:', response.data); // Debugging: Log the backend response
            if (response.data && response.data.extracted_texts) {
                setExtractedTexts(response.data.extracted_texts);
            } else {
                setError('Failed to upload image.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Error uploading file, please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-6">SmartBookShelf</h1>
            <div className="mb-6">
                <input type="file" onChange={handleFileChange} className="mb-2" />
                {uploadedImage && (
                    <div className="relative w-64 h-64 mb-4">
                        <Image src={uploadedImage} alt="Uploaded" layout="fill" objectFit="contain" />
                    </div>
                )}
                <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Upload
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extractedTexts.map((item, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <Image src={`/uploads/${item.image_path}`} alt={`Book ${index + 1}`} width={200} height={300} className="mb-4 rounded-lg" />
                        <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
                        <p className="text-gray-700">{item.text || 'No text detected'}</p>
                    </div>
                ))}
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>
    );
}
