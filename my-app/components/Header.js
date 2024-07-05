import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithGithub, logout } from '../firebase';

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
            <div className="relative group">
              <button className="bg-purple-500 text-white px-4 py-2 rounded">
                Login
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  onClick={signInWithGoogle}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                >
                  Login with Google
                </a>
                <a
                  onClick={signInWithGithub}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                >
                  Login with GitHub
                </a>
                <Link href="/login">
                  <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">
                    Login with Email
                  </a>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
