import React, { useState } from 'react';

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
          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default UploadButton;
