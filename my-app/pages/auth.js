import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { signInWithEmail, signUpWithEmail, resetPassword, signInWithGithub } from '../firebase'; // Add your Firebase functions

const Auth = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
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
      setLoadingForm(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert('Please enter your email address first.');
      return;
    }
    setLoadingForm(true);
    try {
      await resetPassword(email);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert(error.message);
    } finally {
      setLoadingForm(false);
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
        <meta name="description" content="Authenticate to SmartBookshelf.io" />
      </Head>
      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6">{isSigningUp ? 'Sign Up' : 'Login'}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="block text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
                style={{ color: 'black' }}
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
                style={{ color: 'black' }}
              />
            </div>
            <button
              style={{
                backgroundColor: '#6B46C1', // Purple color
                color: '#FFFFFF', // White text
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
              }}
              type="submit"
              disabled={loadingForm}
            >
              {loadingForm ? (isSigningUp ? 'Registering...' : 'Logging in...') : (isSigningUp ? 'Sign Up' : 'Login')}
            </button>
            <div className="text-center mt-4">
              <button
                style={{
                  backgroundColor: '#6B46C1', // Purple color
                  color: '#FFFFFF', // White text
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                  width: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
                }}
                type="button"
                onClick={() => setIsSigningUp(!isSigningUp)}
              >
                {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
              {!isSigningUp && email && (
                <button
                  style={{
                    backgroundColor: '#6B46C1', // Purple color
                    color: '#FFFFFF', // White text
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
                  }}
                  type="button"
                  onClick={handleResetPassword}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="text-center mt-4">
              <button
                style={{
                  backgroundColor: '#6B46C1', // Purple color
                  color: '#FFFFFF', // White text
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                  width: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
                }}
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-2 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.06 0 5.37 1.06 7.01 2.73l5.25-5.25C33.64 3.72 29.27 2 24 2 14.77 2 7.14 8.23 4.21 16.82l6.94 5.25C12.68 15.34 17.81 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M44.5 24c0-1.67-.15-3.29-.44-4.85H24v9.19h11.68c-.51 2.69-1.97 4.97-4.17 6.51l6.57 5.25c3.89-3.59 6.42-8.92 6.42-15.1z"></path>
                  <path fill="#FBBC05" d="M6.95 28.32C6.37 26.67 6 24.87 6 23s.37-3.67.95-5.32l-6.94-5.25C.37 16.21 0 19.54 0 23s.37 6.79 1.01 10.57l6.94-5.25z"></path>
                  <path fill="#34A853" d="M24 43.5c5.27 0 9.64-1.72 12.85-4.67l-6.57-5.25c-1.84 1.31-4.16 2.14-6.28 2.14-5.19 0-9.32-3.53-10.85-8.3l-6.94 5.25C7.14 39.77 14.77 43.5 24 43.5z"></path>
                </svg>
                <span>Login with Google</span>
              </button>
              <button
                style={{
                  backgroundColor: '#6B46C1', // Purple color
                  color: '#FFFFFF', // White text
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 1)',
                  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                  width: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#553C9A'; // Darker purple on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6B46C1'; // Original purple
                }}
                type="button"
                onClick={handleGithubSignIn}
                className="mt-2 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.09.58 1.24.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.97 0-.88.31-1.6.82-2.16-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.16 0 3.09-1.87 3.77-3.65 3.97.29.25.54.73.54 1.47 0 1.06-.01 1.92-.01 2.18 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span>Login with GitHub</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
