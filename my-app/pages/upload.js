// pages/upload.js
import React, { useState } from 'react';
import Head from 'next/head';
import MultiCrop from '../components/MultiCrop';

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropsComplete = (images) => {
    setCroppedImages(images);
    // You can now process these cropped images individually
    // For example, you can send them to your server or perform other actions
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12" style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      color: "#ffffff"
    }}>
      <Head>
        <title>Upload and Crop - SmartBookshelf.io</title>
        <meta name="description" content="Upload and crop images for SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Upload and Crop Images</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 text-white"
          style={{ color: 'white' }}
        />
        {selectedImage && <MultiCrop image={selectedImage} onCropComplete={handleCropsComplete} />}
        <div className="mt-4">
          {croppedImages.map((img, index) => (
            <img key={index} src={img} alt={`Cropped ${index + 1}`} className="m-2 border" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
