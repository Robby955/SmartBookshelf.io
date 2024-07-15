// components/PasswordProtect.js
import { useState } from 'react';

const PasswordProtect = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start py-12" style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff"
      }}>
        <form onSubmit={handlePasswordSubmit} className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-24">
          <h1 className="text-2xl font-bold mb-4 text-white">Enter Admin Password</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs text-black mb-4"
            placeholder="Password"
          />
          <button type="submit" className="btn btn-primary mb-4">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return children;
};

export default PasswordProtect;
