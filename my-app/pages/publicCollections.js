import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import PasswordProtect from '../components/PasswordProtect';

const PublicCollectionsPage = () => {
  const { user } = useAuth();
  const [publicCollections, setPublicCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPublicCollections();
    }
  }, [user]);

  const fetchPublicCollections = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'collections'), where('public', '==', true));
      const querySnapshot = await getDocs(q);
      const fetchedCollections = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching public collections:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-6">Public Collections</h1>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : (
            <div className="w-full">
              {publicCollections.length > 0 ? (
                publicCollections.map((collection) => (
                  <div key={collection.id} className="card w-full bg-base-100 shadow-xl mb-4">
                    <div className="card-body">
                      <h2 className="card-title text-black">{collection.name}</h2>
                      <p className="text-black">{collection.description}</p>
                      <p className="text-black">{collection.public ? 'Public' : 'Private'}</p>
                      <div>
                        <h3 className="text-lg font-bold text-black mt-4">Books in Collection</h3>
                        {collection.books.length > 0 ? (
                          <ul>
                            {collection.books.map(bookId => (
                              <li key={bookId} className="text-black">
                                {bookId}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-black">No books in this collection.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-700 font-bold">No public collections found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </PasswordProtect>
  );
};

export default PublicCollectionsPage;
