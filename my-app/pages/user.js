import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { CSVLink } from 'react-csv';

const UserPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUploads, setTotalUploads] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

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

        if (!userDoc.exists()) {
          console.log(`No user data found for user: ${user.uid}. Creating user document.`);
          await setDoc(userDocRef, { username: user.displayName, total_uploads: 0 });
          setTotalUploads(0);
        } else {
          console.log('User data:', userDoc.data());
          setTotalUploads(userDoc.data().total_uploads);
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
      await setDoc(doc(db, 'users', user.uid), { total_uploads: newTotalUploads }, { merge: true });
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again later.');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Only append userID if user is logged in
    if (user) {
      formData.append('userID', user.uid);
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl); // Debugging line

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      console.log('File uploaded successfully');
      // Optionally refresh the book list
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again later.');
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
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No books found.</p>
      )}
      <div className="mt-4">
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={handleFileUpload} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Upload File</button>
      </div>
      {!user && (
        <div className="container mx-auto p-4">
          <p className="text-xl">Please <Link href="/login"><a className="text-blue-500 underline">log in</a></Link> to see your books.</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
