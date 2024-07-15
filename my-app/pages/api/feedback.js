// pages/api/feedback.js
export default async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Handle the feedback submission (e.g., save to a database, send an email, etc.)
  // For simplicity, we'll just log the feedback to the console
  console.log('Feedback received:', { name, email, message });

  return res.status(200).json({ message: 'Feedback received' });
};
