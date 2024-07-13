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
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setTotalBooks(userDoc.data().total_books || 0);
        } else {
          setTotalBooks(0);
        }

        const q = query(collection(db, 'uploads'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(userBooks);
        setTotalBooks(userBooks.length);
      } catch (err) {
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
      const newTotalBooks = totalBooks - 1;
      setTotalBooks(newTotalBooks);
      await updateDoc(doc(db, 'users', user.uid), { total_books: newTotalBooks });
    } catch (err) {
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
      setIsAddingBook(false);
    } catch (err) {
      setError('Failed to add book. Please try again later.');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBookText(book.text);
    setIsAddingBook(true);
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
      setIsAddingBook(false);
    } catch (err) {
      setError('Failed to update book. Please try again later.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAnalyzeBooks = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ books }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze books');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      setError('Failed to analyze books. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">My Books</h1>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchQuery}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-xs"
          style={{ color: 'black' }}
        />
      </div>
      <div className="flex justify-between mb-4 space-x-4">
        <button
          onClick={() => setIsAddingBook(true)}
          className="btn btn-primary"
          style={{
            paddingTop: '5px',
            paddingRight: '10px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'block',
            width: '80px',
            height: '30px',
            color: 'white' //
          }}
        >
          Add Book
        </button>
        <CSVLink
          data={books}
          headers={headers}
          filename={`books-${user.uid}.csv`}
          className="btn btn-success"
          style={{
            paddingTop: '5px',
            paddingRight: '10px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'block',
            width: '80px',
            height: '30px',
            color: 'white' //
          }}
        >
          Export to CSV
        </CSVLink>
        <button
          onClick={handleAnalyzeBooks}
          className="btn btn-error"
          style={{
            paddingTop: '5px',
            paddingRight: '10px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'block',
            width: '90px',
            height: '30px',
            color: 'white' //
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
        </button>
        <button
          onClick={handleDeleteAllBooks}
          className="btn btn-danger"
style={{
  paddingTop: '5px',
  paddingRight: '10px',
  paddingBottom: '5px',
  paddingLeft: '10px',
  borderRadius: '5px',
  fontSize: '13px',
  fontWeight: 'bold',
  textAlign: 'center',
  display: 'block',
  width: '80px',
  height: '30px',
  color: 'white' //
}}
        >
          Delete All Books
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}  {/* Display the error message */}
      <p className="text-white">Total Books: {totalBooks}</p>
      {isAddingBook && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Book Text"
            value={newBookText}
            onChange={(e) => setNewBookText(e.target.value)}
            className="input input-bordered w-full max-w-xs"
            style={{ color: 'black' }}
          />
          {editingBook ? (
            <button onClick={handleUpdateBook} className="btn btn-primary">
              Update Book
            </button>
          ) : (
            <button onClick={handleAddBook} className="btn btn-primary">
              Add Book
            </button>
          )}
          <button onClick={() => setIsAddingBook(false)} className="btn btn-secondary mt-2">
            Cancel
          </button>
        </div>
      )}
      {analysisResult && (
        <div className="mt-4 p-4 bg-white rounded shadow mb-4">
          <h2 className="text-xl font-bold mb-2 text-black">Analysis Result</h2>
          <p className="text-black">{analysisResult}</p>
        </div>
      )}
      {filteredBooks.length > 0 ? (
        <>
          <ul>
            {filteredBooks.map((book) => (
              <li key={book.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{book.text}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="text-yellow-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L8 19.5 3 21l1.5-5L16.732 5.232z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-white">No books found.</p>
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
