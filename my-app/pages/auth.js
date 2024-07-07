import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSigningUp) {
        await signUpWithEmail(email, password);
        alert('Registration successful. Please check your email for verification.');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email address first.');
      return;
    }
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
          {loading ? (isSigningUp ? 'Registering...' : 'Logging in...') : (isSigningUp ? 'Sign Up' : 'Login')}
        </button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-blue-500"
          >
            {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
          {!isSigningUp && (
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-blue-500 mt-2"
            >
              Forgot Password?
            </button>
          )}
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={signInWithGoogle}
            className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
          >
            Login with Google
          </button>
          <button
            type="button"
            onClick={signInWithGithub}
            className="bg-gray-800 text-white px-4 py-2 rounded w-full mt-2"
          >
            Login with GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
