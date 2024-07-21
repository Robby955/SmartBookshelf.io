import { useState } from 'react';
import axios from 'axios';
import PasswordProtect from './PasswordProtect';

const PlagiarismDetector = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleCheckPlagiarism = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('/api/checkPlagiarism', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.result);
      setHistory([response.data.result, ...history]);
    } catch (error) {
      console.error('Error checking plagiarism:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordProtect>
      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Plagiarism Detector</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea textarea-bordered w-full h-48 text-black mb-4"
          placeholder="Paste your text here..."
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-bordered w-full mb-4"
        />
        <button onClick={handleCheckPlagiarism} className="btn btn-primary mb-4" disabled={loading}>
          {loading ? 'Checking...' : 'Check Plagiarism'}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2 text-black">Plagiarism Check Result</h2>
            <p className="text-black whitespace-pre-wrap">{result}</p>
          </div>
        )}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2 text-white">History</h2>
          {history.map((item, index) => (
            <div key={index} className="p-4 bg-white rounded shadow mb-4">
              <p className="text-black whitespace-pre-wrap">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default PlagiarismDetector;
