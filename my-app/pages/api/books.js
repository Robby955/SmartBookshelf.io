import { firestore } from '../../lib/firebaseAdmin';

const booksHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET': {
      // Get all books in a collection
      const { collectionId } = req.query;
      const booksRef = firestore.collection('books');
      const snapshot = await booksRef.where('collectionID', '==', collectionId).get();
      const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(books);
    }

    case 'POST': {
      // Add a new book to a collection
      const { title, author, isbn, description, forSale, collectionID, owner } = req.body;
      await firestore.collection('books').add({
        title,
        author,
        isbn,
        description,
        forSale,
        collectionID,
        owner,
        interestedParties: [],
      });
      return res.status(201).json({ message: 'Book added to collection' });
    }

    case 'PUT': {
      // Update a book in a collection
      const { bookId, updateData } = req.body;
      await firestore.collection('books').doc(bookId).update(updateData);
      return res.status(200).json({ message: 'Book updated' });
    }

    case 'DELETE': {
      // Delete a book from a collection
      const { bookIdToDelete } = req.body;
      await firestore.collection('books').doc(bookIdToDelete).delete();
      return res.status(200).json({ message: 'Book deleted from collection' });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default booksHandler;
