import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const EssayWriter = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [minWords, setMinWords] = useState(100);
  const [style, setStyle] = useState('');
  const [essay, setEssay] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(userBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [user]);

  const handleGenerateEssay = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: selectedBook,
          minWords,
          style,
        }),
      });

      const data = await response.json();
      setEssay(data.essay);
    } catch (error) {
      console.error('Error generating essay:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Essay Writer (Pro)</h1>
      <div className="mb-4">
        <label htmlFor="book" className="block text-white mb-2">Select Book:</label>
        <select
          id="book"
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="input input-bordered w-full text-black"
        >
          <option value="" className="text-black">Select a book</option>
          {books.map(book => (
            <option key={book.id} value={book.text} className="text-black">{book.text}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="minWords" className="block text-white mb-2">Minimum Words:</label>
        <input
          type="number"
          id="minWords"
          value={minWords}
          onChange={(e) => setMinWords(Number(e.target.value))}
          className="input input-bordered w-full text-black"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="style" className="block text-white mb-2">Style:</label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="input input-bordered w-full text-black"
        >
          <option value="" className="text-black">Select style</option>
          <option value="elementary" className="text-black">Elementary School</option>
          <option value="middle" className="text-black">Middle School</option>
          <option value="high" className="text-black">High School</option>
          <option value="university" className="text-black">University</option>
          <option value="advanced" className="text-black">Advanced PhD</option>
        </select>
      </div>
      <button
        onClick={handleGenerateEssay}
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Essay'}
      </button>
      {essay && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-
">Generated Essay</h2>
          <p className="text-black">{essay}</p>
        </div>
      )}
    </div>
  );
};

export default EssayWriter;
