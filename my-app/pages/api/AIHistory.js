import { db } from '../../firebase'; // Ensure to import your Firebase instance
import { collection, query, where, getDocs } from 'firebase/firestore';

const aiHistory = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'No user ID provided for fetching AI check history' });
  }

  try {
    const q = query(collection(db, 'ai_checks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach(doc => {
      history.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching AI check history:', error);
    res.status(500).json({ message: 'Failed to fetch AI check history' });
  }
};

export default aiHistory;
