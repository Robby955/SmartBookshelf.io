import { useState } from 'react';
import axios from 'axios';
import withAdmin from '../middleware/withAdmin';

const PlagiarismDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckPlagiarism = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/checkPlagiarism', { text });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error checking plagiarism:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Plagiarism Detector</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="textarea textarea-bordered w-full h-48 text-black mb-4"
        placeholder="Paste your text here..."
      />
      <button onClick={handleCheckPlagiarism} className="btn btn-primary mb-4" disabled={loading}>
        {loading ? 'Checking...' : 'Check Plagiarism'}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-black">Plagiarism Check Result</h2>
          <p className="text-black">{result}</p>
        </div>
      )}
    </div>
  );
};

export default withAdmin(PlagiarismDetector);
