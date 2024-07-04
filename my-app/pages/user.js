// pages/user.js
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

const UserPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'books'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBooks(userBooks);
        } catch (err) {
          console.error('Error fetching books:', err);
          setError('Failed to fetch books. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-xl">Please <Link href="/login"><a className="text-blue-500 underline">log in</a></Link> to see your books.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      {error && <p className="text-red-500">{error}</p>}
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id} className="mb-2 p-2 border rounded">
              <p className="font-bold">{book.title}</p>
              <p>{book.author}</p>
              <p>{new Date(book.scanDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default UserPage;
