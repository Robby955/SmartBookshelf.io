// pages/api/collections.js
import { firestore } from '../../lib/firebaseAdmin';

const handleGetCollections = async (req, res) => {
  const { userId } = req.query;
  const collectionsRef = firestore.collection('collections');
  const snapshot = await collectionsRef.where('owner', '==', userId).get();
  const collections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.status(200).json(collections);
};

const handlePostCollection = async (req, res) => {
  const { name, description, owner } = req.body;
  await firestore.collection('collections').add({
    name,
    description,
    owner,
    public: false,
    books: [],
  });
  res.status(201).json({ message: 'Collection added' });
};

const handlePutCollection = async (req, res) => {
  const { collectionId, updateData } = req.body;
  await firestore.collection('collections').doc(collectionId).update(updateData);
  res.status(200).json({ message: 'Collection updated' });
};

const handleDeleteCollection = async (req, res) => {
  const { collectionIdToDelete } = req.body;
  await firestore.collection('collections').doc(collectionIdToDelete).delete();
  res.status(200).json({ message: 'Collection deleted' });
};

const collectionsHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      await handleGetCollections(req, res);
      break;
    case 'POST':
      await handlePostCollection(req, res);
      break;
    case 'PUT':
      await handlePutCollection(req, res);
      break;
    case 'DELETE':
      await handleDeleteCollection(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default collectionsHandler;
