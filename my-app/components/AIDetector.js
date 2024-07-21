import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PasswordProtect from './PasswordProtect';

const AIDetector = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`/api/aiHistory`);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCheckAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/checkAI', { text });
      setResult(response.data.result);
      fetchHistory();
    } catch (error) {
      console.error('Error checking AI content:', error);
      setResult('Failed to check AI content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordProtect>
      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">AI Detector</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea textarea-bordered w-full text-black mb-4"
          placeholder="Enter text to check for AI content"
        ></textarea>
        <button
          onClick={handleCheckAI}
          className="btn btn-primary mb-4"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check AI Content'}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2 text-black">AI Detection Result</h2>
            <p className="text-black">
              {result.isAIContent ? "The text is AI-generated." : "The text is human-generated."}
            </p>
            <p className="text-black">{result.text}</p>
            <p className="text-black text-sm">{`Checked at: ${new Date(result.checkedAt).toLocaleString()}`}</p>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2 text-white">Detection History</h2>
          {history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className="mt-4 p-4 bg-white rounded shadow">
                <p className="text-black">
                  {item.isAIContent ? "AI-generated" : "Human-generated"}
                </p>
                <p className="text-black">{item.text}</p>
                <p className="text-black text-sm">{`Checked at: ${new Date(item.checkedAt).toLocaleString()}`}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No history found.</p>
          )}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default AIDetector;
