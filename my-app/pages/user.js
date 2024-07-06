import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { CSVLink } from 'react-csv';

const UserPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUploads, setTotalUploads] = useState(0);
  const [newBookText, setNewBookText] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching user data for user: ${user.uid}`);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log('User data:', userDoc.data());
          setTotalUploads(userDoc.data().total_uploads);
        } else {
          console.log(`No user data found for user: ${user.uid}.`);
        }

        const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched books:', userBooks);
        setBooks(userBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) {
      setError('User is not logged in.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'uploads', id));
      setBooks(books.filter(book => book.id !== id));
      const newTotalUploads = totalUploads - 1;
      setTotalUploads(newTotalUploads);
      await updateDoc(doc(db, 'users', user.uid), { total_uploads: newTotalUploads });
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again later.');
    }
  };

  const handleAddBook = async () => {
    if (!newBookText) {
      setError('Please provide text for the new book.');
      return;
    }

    try {
      const newBookRef = doc(collection(db, 'uploads'));
      const newBook = {
        text: newBookText,
        userId: user.uid,
      };
      await setDoc(newBookRef, newBook);
      setBooks([...books, { id: newBookRef.id, ...newBook }]);
      const newTotalUploads = totalUploads + 1;
      setTotalUploads(newTotalUploads);
      await updateDoc(doc(db, 'users', user.uid), { total_uploads: newTotalUploads });
      setNewBookText('');
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again later.');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBookText(book.text);
  };

  const handleUpdateBook = async () => {
    if (!newBookText) {
      setError('Please provide text for the book.');
      return;
    }

    try {
      await updateDoc(doc(db, 'uploads', editingBook.id), {
        text: newBookText,
      });
      setBooks(books.map(book => (book.id === editingBook.id ? { ...book, text: newBookText } : book)));
      setEditingBook(null);
      setNewBookText('');
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Failed to update book. Please try again later.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const headers = [
    { label: 'Text', key: 'text' },
    { label: 'Image URL', key: 'imageURL' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Books</h1>
      {user && <p>Total Uploads: {totalUploads}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Book Text"
          value={newBookText}
          onChange={(e) => setNewBookText(e.target.value)}
          className="mb-2 p-2 border rounded"
          style={{ color: 'black' }}
        />
        {editingBook ? (
          <button onClick={handleUpdateBook} className="bg-green-500 text-white px-4 py-2 rounded">
            Update Book
          </button>
        ) : (
          <button onClick={handleAddBook} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Book
          </button>
        )}
      </div>
      {books.length > 0 ? (
        <>
          {user && (
            <CSVLink
              data={books}
              headers={headers}
              filename={`books-${user.uid}.csv`}
              className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              Export to CSV
            </CSVLink>
          )}
          <ul>
            {books.map((book) => (
              <li key={book.id} className="mb-2 p-2 border rounded">
                <p className="font-bold">{book.text}</p>
                <p><a href={book.imageURL} target="_blank" rel="noopener noreferrer">View Image</a></p>
                {user && (
                  <>
                    <button
                      onClick={() => handleEditBook(book)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No books found.</p>
      )}
      {!user && (
        <div className="container mx-auto p-4">
          <p className="text-xl">Please <Link href="/login"><a className="text-blue-500 underline">log in</a></Link> to see your books.</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
