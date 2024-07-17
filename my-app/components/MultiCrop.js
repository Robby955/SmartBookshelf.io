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
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
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
        className="btn btn-primary w-full mt-4"
        style={{
          backgroundColor: '#1E40AF',
          borderColor: '#1E40AF',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 0',
          borderRadius: '8px',
        }}
        type="button"
      >
        Add Crop
      </button>
    </div>
  );
};

export default MultiCrop;
