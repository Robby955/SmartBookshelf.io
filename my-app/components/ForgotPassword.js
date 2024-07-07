import React, { useState } from 'react';
import { resetPassword } from '../firebase';  // Adjust the import path as needed

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
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
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleForgotPassword} disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
    </div>
  );
};

export default ForgotPassword;
