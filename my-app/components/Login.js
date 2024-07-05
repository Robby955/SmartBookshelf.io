import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSigningUp) {
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6">{isSigningUp ? 'Sign Up' : 'Login'}</h1>
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
          {isSigningUp ? 'Sign Up' : 'Login'}
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-blue-500"
          >
            {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
