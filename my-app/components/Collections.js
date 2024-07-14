import { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordProtect from '../components/PasswordProtect';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: '', description: '', public: false });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('/api/collections', { params: { userId: 'currentUserId' } });
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  const handleCreateCollection = async () => {
    try {
      await axios.post('/api/collections', newCollection);
      setNewCollection({ name: '', description: '', public: false });
      const response = await axios.get('/api/collections', { params: { userId: 'currentUserId' } });
      setCollections(response.data);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleDeleteCollection = async (id) => {
    try {
      await axios.delete('/api/collections', { data: { collectionId: id } });
      setCollections(collections.filter(collection => collection.id !== id));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  return (
    <PasswordProtect>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Manage Collections</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Collection Name"
            value={newCollection.name}
            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="Collection Description"
            value={newCollection.description}
            onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
            className="input input-bordered w-full mb-2"
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
          <button onClick={handleCreateCollection} className="btn btn-primary">Create Collection</button>
        </div>
        <div>
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-bold">{collection.name}</h2>
              <p>{collection.description}</p>
              <p>{collection.public ? 'Public' : 'Private'}</p>
              <button onClick={() => handleDeleteCollection(collection.id)} className="btn btn-danger">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default Collections;
