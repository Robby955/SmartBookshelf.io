import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6">Forgot Password</h1>
      <form onSubmit={handleForgotPassword} className="bg-white p-6 rounded shadow-md w-80">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
        <div className="text-center mt-4">
          <Link href="/auth" passHref>
            <a className="text-blue-500">Back to Login</a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
