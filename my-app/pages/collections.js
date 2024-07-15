import React, { useState, useEffect } from 'react';
import PasswordProtect from '../components/PasswordProtect';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const CollectionsPage = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: '', description: '', public: false });
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCollections(user);
      fetchBooks(user);
    } else {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          fetchCollections(currentUser);
          fetchBooks(currentUser);
        }
      });
    }
  }, [user]);

  const fetchCollections = async (currentUser) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'collections'), where('owner', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedCollections = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async (currentUser) => {
    try {
      const q = query(collection(db, 'uploads'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedBooks = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollection.name) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'collections'), {
        ...newCollection,
        owner: user.uid,
        books: [],
      });
      setNewCollection({ name: '', description: '', public: false });
      fetchCollections(user);
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'collections', id));
      setCollections(collections.filter(collection => collection.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async (id, currentStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'collections', id), {
        public: !currentStatus,
      });
      fetchCollections(user);
    } catch (error) {
      console.error('Error updating collection status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookToCollection = async (bookId, collectionId) => {
    try {
      const collectionRef = doc(db, 'collections', collectionId);
      const collectionDoc = await getDoc(collectionRef);
      if (collectionDoc.exists()) {
        const collectionData = collectionDoc.data();
        const updatedBooks = [...collectionData.books, bookId];
        await updateDoc(collectionRef, { books: updatedBooks });
        fetchCollections(user);
      }
    } catch (error) {
      console.error('Error adding book to collection:', error);
    }
  };

  const handleRemoveBookFromCollection = async (bookId, collectionId) => {
    try {
      const collectionRef = doc(db, 'collections', collectionId);
      const collectionDoc = await getDoc(collectionRef);
      if (collectionDoc.exists()) {
        const collectionData = collectionDoc.data();
        const updatedBooks = collectionData.books.filter(id => id !== bookId);
        await updateDoc(collectionRef, { books: updatedBooks });
        fetchCollections(user);
      }
    } catch (error) {
      console.error('Error removing book from collection:', error);
    }
  };

  if (!user) {
    return <p className="text-center text-white">Please login to manage collections.</p>;
  }

  return (
    <PasswordProtect>
      <div className="min-h-screen flex flex-col items-center py-12" style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff"
      }}>
        <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
          <h1 className="text-4xl font-bold text-white mb-6">Manage Collections</h1>
          <div className="mb-4 w-full">
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              className="input input-bordered w-full mb-2 text-black"
            />
            <input
              type="text"
              placeholder="Collection Description"
              value={newCollection.description}
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              className="input input-bordered w-full mb-2 text-black"
            />
            <label className="label cursor-pointer">
              <span className="label-text text-white">Public</span>
              <input
                type="checkbox"
                checked={newCollection.public}
                onChange={(e) => setNewCollection({ ...newCollection, public: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
            <button onClick={handleCreateCollection} className="btn btn-primary" disabled={loading}>
              Create Collection
            </button>
          </div>
          {loading ? (
            <p className="text-black">Loading...</p>
          ) : (
            <div className="w-full">
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <div key={collection.id} className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="text-xl font-bold text-black">{collection.name}</h2>
                    <p className="text-black">{collection.description}</p>
                    <p className="text-black">{collection.public ? 'Public' : 'Private'}</p>
                    <button
                      onClick={() => handleTogglePublic(collection.id, collection.public)}
                      className={`btn ${collection.public ? 'btn-success' : 'btn-warning'} mr-2`}
                    >
                      {collection.public ? 'Make Private' : 'Make Public'}
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-black mt-4">Books in Collection</h3>
                      {collection.books.length > 0 ? (
                        <ul>
                          {collection.books.map(bookId => (
                            <li key={bookId} className="text-black">
                              {books.find(book => book.id === bookId)?.text || 'Unknown Book'}
                              <button
                                onClick={() => handleRemoveBookFromCollection(bookId, collection.id)}
                                className="text-red-500 ml-2"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-black">No books in this collection.</p>
                      )}
                      <select
                        onChange={(e) => handleAddBookToCollection(e.target.value, collection.id)}
                        className="select select-bordered w-full mt-2"
                      >
                        <option value="">Add a book to this collection</option>
                        {books.filter(book => !collection.books.includes(book.id)).map(book => (
                          <option key={book.id} value={book.id}>{book.text}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-700 font-bold">No collections found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default CollectionsPage;
