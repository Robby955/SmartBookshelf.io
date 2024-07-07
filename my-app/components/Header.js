import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithGithub, logout } from '../firebase';

const Header = () => {
  const { user } = useAuth();

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
          <Link href="/about" legacyBehavior>
            <a className="text-white">About</a>
          </Link>
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
            <>
              <Link href="/auth" legacyBehavior>
                <a className="text-white">Login</a>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
