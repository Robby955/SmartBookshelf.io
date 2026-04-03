import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';

const Header = () => {
  const { user } = useAuth();

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
          <Link href="/faq" legacyBehavior>
            <a className="text-white">FAQ</a>
          </Link>
          {user ? (
            <>
              <Link href="/user" legacyBehavior>
                <a className="text-white">My Books</a>
              </Link>
              <Link href="/collections" legacyBehavior>
                <a className="text-white">Collections</a>
              </Link>
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
              <a className="btn btn-primary text-white text-sm">Sign In</a>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
