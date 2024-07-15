import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

const Feedback = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/feedback', { name, email, message });
      setFeedbackSent(true);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to send feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12" style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      color: "#ffffff"
    }}>
      <Head>
        <title>Feedback - SmartBookshelf.io</title>
        <meta name="description" content="Provide feedback for SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-white mb-6">Feedback</h1>
        {feedbackSent ? (
          <p className="text-white">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                rows="5"
                placeholder="Your Feedback"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                  style={{
                    backgroundColor: '#6B46C1', // Purple color
                    color: '#FFFFFF', // White text
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
                  }}
                  type="submit"
                  disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
