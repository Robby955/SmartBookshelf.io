import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedTexts, setExtractedTexts] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedTexts(response.data.extracted_texts);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">SmartBookShelf</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {extractedTexts.map((item, index) => (
          <div key={index} className="border p-2">
            <img src={`http://localhost:8000/${item.image_path}`} alt={`Book ${index}`} className="mb-2" />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
