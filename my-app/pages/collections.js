import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Make sure to import your firebase instance
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Make sure to import your Auth context if you have one

const CollectionsPage = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'collections'));
      const fetchedCollections = [];
      querySnapshot.forEach((doc) => {
        fetchedCollections.push({ id: doc.id, ...doc.data() });
      });
      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'collections'), {
        name: newCollectionName,
        owner: user.uid,
        public: true,
        books: [],
      });
      setNewCollectionName('');
      fetchCollections();
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
      fetchCollections();
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
      fetchCollections();
    } catch (error) {
      console.error('Error updating collection status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-center text-white">Please login to manage collections.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Manage Collections</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New Collection Name"
          className="input input-bordered w-full mb-2 text-black" // Add text-black class here
        />
        <button onClick={handleCreateCollection} className="btn btn-primary" disabled={loading}>
          Create Collection
        </button>
      </div>
      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <div>
          {collections.length > 0 ? (
            collections.map((collection) => (
              <div key={collection.id} className="mb-4 p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-2 text-black">{collection.name}</h2>
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
              </div>
            ))
          ) : (
            <p className="text-black">No collections found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
