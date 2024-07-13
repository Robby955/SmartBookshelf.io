// pages/essay-writer.js

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';

const EssayWriter = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [minWords, setMinWords] = useState(500);
  const [maxWords, setMaxWords] = useState(1000);
  const [style, setStyle] = useState('');
  const [essayFormat, setEssayFormat] = useState('');
  const [promptType, setPromptType] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');
  const [essay, setEssay] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(userBooks);
      }
    };

    fetchBooks();
  }, [user]);

  const handleGenerateEssay = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generateEssay', {
        book: selectedBook,
        minWords,
        maxWords,
        style,
        essayFormat,
        promptType,
        customKeyword,
      });
      setEssay(response.data.essay);
    } catch (error) {
      console.error('Error generating essay:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Essay Writer (Pro)</h1>
      <div className="mb-4">
        <label className="block text-white">Select a Book</label>
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="input input-bordered w-full max-w-xs text-black">
          <option value="" disabled>Select a book</option>
          {books.map(book => (
            <option key={book.id} value={book.text}>{book.text}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-white">Word Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min Words"
            value={minWords}
            onChange={(e) => setMinWords(e.target.value)}
            className="input input-bordered w-full max-w-xs text-black"
          />
          <input
            type="number"
            placeholder="Max Words"
            value={maxWords}
            onChange={(e) => setMaxWords(e.target.value)}
            className="input input-bordered w-full max-w-xs text-black"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-white">Style (Optional)</label>
        <select value={style} onChange={(e) => setStyle(e.target.value)} className="input input-bordered w-full max-w-xs text-black">
          <option value="">No Style</option>
          <option value="elementary">Elementary School</option>
          <option value="middle">Middle School</option>
          <option value="highschool">High School</option>
          <option value="university">University</option>
          <option value="phd">Advanced (PhD)</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-white">Essay Format (Optional)</label>
        <select value={essayFormat} onChange={(e) => setEssayFormat(e.target.value)} className="input input-bordered w-full max-w-xs text-black">
          <option value="">No Format</option>
          <option value="argumentative">Argumentative</option>
          <option value="descriptive">Descriptive</option>
          <option value="expository">Expository</option>
          <option value="narrative">Narrative</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-white">Prompt Type (Optional)</label>
        <select value={promptType} onChange={(e) => setPromptType(e.target.value)} className="input input-bordered w-full max-w-xs text-black">
          <option value="">No Prompt</option>
          <option value="summary">Summary</option>
          <option value="characterAnalysis">Character Analysis</option>
          <option value="thematicAnalysis">Thematic Analysis</option>
          <option value="quoteExplanation">Quote Explanation</option>
          <option value="comparison">Comparison</option>
          <option value="contextualAnalysis">Contextual Analysis</option>
          <option value="authorPurpose">Author’s Purpose</option>
          <option value="criticalReception">Critical Reception</option>
          <option value="impactLegacy">Impact and Legacy</option>
          <option value="custom">Custom Keyword</option>
        </select>
      </div>
      {promptType === 'custom' && (
        <div className="mb-4">
          <label className="block text-white">Custom Keyword</label>
          <input type="text" value={customKeyword} onChange={(e) => setCustomKeyword(e.target.value)} className="input input-bordered w-full max-w-xs text-black" />
        </div>
      )}
      <button onClick={handleGenerateEssay} className="btn btn-primary" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Essay'}
      </button>
      {essay && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-black">Generated Essay</h2>
          <p className="text-black">{essay}</p>
        </div>
      )}
    </div>
  );
};

export default EssayWriter;
