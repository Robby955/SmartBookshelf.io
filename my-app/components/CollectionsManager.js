// components/CollectionsManager.js
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CollectionsManager = () => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [user, setUser] = useState(null);

  const fetchCollections = async (currentUser) => {
    if (currentUser) {
      const q = query(collection(db, 'collections'), where('owner', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const collectionsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setCollections(collectionsData);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchCollections(currentUser);
    });
  }, []);

  const addCollection = async () => {
    try {
      await addDoc(collection(db, 'collections'), {
        name: newCollectionName,
        description: newCollectionDescription,
        owner: user.uid,
        public: false,
        books: []
      });
      setNewCollectionName('');
      setNewCollectionDescription('');
      fetchCollections(user);
    } catch (error) {
      console.error('Error adding collection: ', error);
    }
  };

  const updateCollection = async (id, updateData) => {
    try {
      await updateDoc(doc(db, 'collections', id), updateData);
      fetchCollections(user);
    } catch (error) {
      console.error('Error updating collection: ', error);
    }
  };

  const deleteCollection = async (id) => {
    try {
      await deleteDoc(doc(db, 'collections', id));
      fetchCollections(user);
    } catch (error) {
      console.error('Error deleting collection: ', error);
    }
  };

  return (
    <div>
      <h1>Manage Collections</h1>
      <input
        type="text"
        value={newCollectionName}
        onChange={(e) => setNewCollectionName(e.target.value)}
        placeholder="Collection Name"
      />
      <textarea
        value={newCollectionDescription}
        onChange={(e) => setNewCollectionDescription(e.target.value)}
        placeholder="Collection Description"
      />
      <button onClick={addCollection}>Add Collection</button>
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>
            <h2>{collection.name}</h2>
            <p>{collection.description}</p>
            <button onClick={() => updateCollection(collection.id, { public: !collection.public })}>
              {collection.public ? 'Make Private' : 'Make Public'}
            </button>
            <button onClick={() => deleteCollection(collection.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsManager;
