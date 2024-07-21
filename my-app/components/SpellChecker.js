import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PasswordProtect from './PasswordProtect';

const SpellChecker = () => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/api/spellCheckHistory?userId=${user.uid}`);
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleCheckSpelling = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/spellCheck', { text, userId: user.uid });
      setResult(response.data.result);
      fetchHistory(); // Refresh history after checking spelling
    } catch (error) {
      console.error('Error checking spelling:', error);
      setResult('Failed to check spelling.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordProtect>
      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Spell Checker</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea textarea-bordered w-full text-black mb-4"
          placeholder="Enter text to check for spelling"
        ></textarea>
        <button
          onClick={handleCheckSpelling}
          className="btn btn-primary mb-4"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Spelling'}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2 text-black">Spell Check Result</h2>
            <p className="text-black">{result}</p>
          </div>
        )}
        <div className="mt-4 p-4 bg-white rounded shadow w-full">
          <h2 className="text-xl font-bold mb-2 text-black">Detection History</h2>
          {history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className="p-2 border-b border-gray-300">
                <p className="text-black">{item.text}</p>
                <p className="text-gray-500 text-sm">Checked at: {new Date(item.checkedAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-black">No history found.</p>
          )}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default SpellChecker;
