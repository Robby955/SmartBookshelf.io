// pages/user.js
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase'; // Assuming you have a Firestore setup in firebase.js
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        const q = query(collection(db, 'books'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(userBooks);
      }
    };

    fetchBooks();
  }, [user]);

  if (!user) {
    return <p>Please log in to see your books.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id} className="mb-2 p-2 border rounded">
              <p className="font-bold">{book.title}</p>
              <p>{book.author}</p>
              <p>{book.scanDate}</p>
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
