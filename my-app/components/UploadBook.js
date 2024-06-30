import { useState } from 'react';

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data.info.text);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload a Book Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} className="mb-4 p-2" />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Extracted Text:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
