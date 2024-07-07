import React, { useState } from 'react';
import Link from 'next/link';
import { signUpWithEmail } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      alert('Registration successful. Please check your email for verification.');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
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
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        <div className="text-center mt-4">
          <Link href="/auth" legacyBehavior>
            <a className="text-blue-500">
              Already have an account? Login
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
