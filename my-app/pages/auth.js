import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, resetPassword } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSigningUp) {
        await signUpWithEmail(email, password);
        alert('Registration successful. Please check your email for verification.');
        router.push('/'); // Redirect after successful sign up
      } else {
        await signInWithEmail(email, password);
        router.push('/'); // Redirect after successful login
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/'); // Redirect after successful Google login
    } catch (error) {
      console.error('Error during Google authentication:', error);
      alert(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      router.push('/'); // Redirect after successful GitHub login
    } catch (error) {
      console.error('Error during GitHub authentication:', error);
      alert(error.message);
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center py-12" style={{
        backgroundImage: "url('background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff"
      }}>

        <Head>
          <title>{isSigningUp ? 'Sign Up' : 'Login'} - SmartBookshelf.io</title>
          <meta name="description" content="Authenticate to SmartBookshelf.io"/>
        </Head>
        <div
            className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">{isSigningUp ? 'Sign Up' : 'Login'}</h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="block text-white">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                  style={{color: 'black'}}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                  style={{color: 'black'}}
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
                  onClick={handleGoogleSignIn}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
              >
                Login with Google
              </button>
              <button
                  type="button"
                  onClick={handleGithubSignIn}
                  className="bg-gray-800 text-white px-4 py-2 rounded w-full mt-2"
              >
                Login with GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Auth;
