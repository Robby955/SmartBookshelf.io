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
    <header className="p-4" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed", backgroundPosition: "center" }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="SmartBookshelf Logo" width={32} height={32} />
          <Link href="/" legacyBehavior>
            <a className="text-white text-lg font-bold">SmartBookshelf</a>
          </Link>
        </div>
        <nav className="space-x-2 flex items-center text-sm">
          <Link href="/" legacyBehavior>
            <a className="text-white">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-white">About</a>
          </Link>
          <Link href="/examples" legacyBehavior>
            <a className="text-white">Examples</a>
          </Link>
          <Link href="/tools" legacyBehavior>
            <a className="text-white">Tools</a>
          </Link>
          {user ? (
            <>
              <Link href="/user" legacyBehavior>
                <a className="text-white">My Books</a>
              </Link>
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-white cursor-pointer">
                  Features
                </span>
                {isDropdownOpen && (
                  <div
                    className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                    style={{ left: '50%', transform: 'translateX(-50%)', top: '100%' }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link href="/collections" legacyBehavior>
                      <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Collections</a>
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-700 text-white rounded"
                style={{ padding: '2px 4px', fontSize: '12px', width: 'auto', height: 'auto' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" legacyBehavior>
              <a className="btn btn-primary text-white text-sm">Login</a>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
