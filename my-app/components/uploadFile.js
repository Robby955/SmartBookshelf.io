import { useState } from 'react';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error('Backend URL is not defined');
      setError('Backend URL is not defined.');
      setUploading(false);
      return;
    }

    const uploadUrl = `${backendUrl}/upload/`;
    console.log('Backend URL:', backendUrl);
    console.log('Upload URL:', uploadUrl);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file, please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} />
      {error && <p className="error">{error}</p>}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadFile;
