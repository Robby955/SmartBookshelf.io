// components/MultiCrop.js
import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const MultiCrop = ({ image, onCropComplete }) => {
  const cropperRef = useRef(null);

  const handleAddCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    croppedCanvas.toBlob((blob) => {
      onCropComplete(blob, croppedCanvas.toDataURL());
    });
  };

  return (
    <div className="mb-4">
      <Cropper
        ref={cropperRef}
        src={image}
        style={{ height: 400, width: '100%' }}
        initialAspectRatio={1}
        guides={true}
        viewMode={1}
      />
      <button
        onClick={handleAddCrop}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        type="button"
      >
        Add Crop
      </button>
    </div>
  );
};

export default MultiCrop;
