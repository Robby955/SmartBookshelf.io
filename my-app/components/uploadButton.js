// my-app/components/UploadButton.js

import React, { useState } from 'react';
import Image from 'next/image';

const UploadButton = () => {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!file}
      >
        Upload
      </button>
      {uploadedImage && (
        <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden">
          <Image src={uploadedImage} alt="Uploaded" layout="fill" objectFit="contain" />
        </div>
      )}
    </div>
  );
};

export default UploadButton;
