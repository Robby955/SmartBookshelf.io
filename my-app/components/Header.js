import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';
import { useState, useRef } from 'react';

const Header = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust delay as needed
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="SmartBookshelf Logo" width={32} height={32} />
          <Link href="/" legacyBehavior>
            <a className="text-white text-xl font-bold">SmartBookshelf</a>
          </Link>
        </div>
        <nav className="space-x-4 flex items-center">
          <Link href="/" legacyBehavior>
            <a className="text-white">Home</a>
          </Link>
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-white cursor-pointer">
              About
            </span>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/about" legacyBehavior>
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">About Us</a>
                </Link>
                <Link href="/faq" legacyBehavior>
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">FAQ</a>
                </Link>
              </div>
            )}
          </div>
          <Link href="/examples" legacyBehavior>
            <a className="text-white">Examples</a>
          </Link>
          {user ? (
            <>
              <Link href="/user" legacyBehavior>
                <a className="text-white">My Books</a>
              </Link>
              <button onClick={logout} className="bg-purple-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" legacyBehavior>
              <a className="text-white">Login</a>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
