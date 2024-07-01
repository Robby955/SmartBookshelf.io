// my-app/components/Header.js

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../firebase';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="SmartBookshelf Logo" width={32} height={32} />
          <Link href="/" legacyBehavior>
            <a className="text-white text-xl font-bold">SmartBookshelf</a>
          </Link>
        </div>
        <nav className="space-x-4">
          <Link href="/" legacyBehavior>
            <a className="text-white">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-white">About Us</a>
          </Link>
          <Link href="/faq" legacyBehavior>
            <a className="text-white">FAQ</a>
          </Link>
          <Link href="/examples" legacyBehavior>
            <a className="text-white">Examples</a>
          </Link>
          <Link href="/feedback" legacyBehavior>
            <a className="text-white">Feedback</a>
          </Link>
          {user ? (
            <>
              <Link href="/user" legacyBehavior>
                <a className="text-white">My Books</a>
              </Link>
              <button onClick={logout} className="bg-purple-500 text-white px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="bg-purple-500 text-white px-4 py-2 rounded">Login</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
