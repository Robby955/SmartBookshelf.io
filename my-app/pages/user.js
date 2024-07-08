import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';
import { CSVLink } from 'react-csv';

const UserPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalBooks, setTotalBooks] = useState(0);
  const [newBookText, setNewBookText] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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
          setTotalBooks(userDoc.data().total_books || 0);
        } else {
          console.log(`No user data found for user: ${user.uid}.`);
          setTotalBooks(0);
        }

        const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched books:', userBooks);
        setBooks(userBooks);
        setTotalBooks(userBooks.length);
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
      const bookToDelete = books.find(book => book.id === id);
      if (!bookToDelete) return;

      await deleteDoc(doc(db, 'uploads', id));
      setBooks(books.filter(book => book.id !== id));
      const newTotalBooks = totalBooks - 1;
      setTotalBooks(newTotalBooks);
      await updateDoc(doc(db, 'users', user.uid), { total_books: newTotalBooks });
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again later.');
    }
  };

  const handleDeleteAllBooks = async () => {
    if (!user) {
      setError('User is not logged in.');
      return;
    }

    try {
      const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setBooks([]);
      setTotalBooks(0);
      await updateDoc(doc(db, 'users', user.uid), { total_books: 0 });
    } catch (err) {
      console.error('Error deleting all books:', err);
      setError('Failed to delete all books. Please try again later.');
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
      const newTotalBooks = totalBooks + 1;
      setTotalBooks(newTotalBooks);
      await updateDoc(doc(db, 'users', user.uid), { total_books: newTotalBooks });
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBooks = books.filter((book) => book.text.toLowerCase().includes(searchQuery.toLowerCase()));

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
      {user && (
        <>
          <p>Total Books: {totalBooks}</p>
        </>
      )}
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
        {user && (
          <button onClick={handleDeleteAllBooks} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Delete All Books
          </button>
        )}
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-2 p-2 border rounded w-full"
          style={{ color: 'black' }}
        />
      </div>
      {filteredBooks.length > 0 ? (
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
            {filteredBooks.map((book) => (
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
