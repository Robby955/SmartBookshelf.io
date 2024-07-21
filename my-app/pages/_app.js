// pages/_app.js
import '../styles/globals.css'; // Import global styles first
import 'tailwindcss/tailwind.css'; // Import TailwindCSS styles
import 'daisyui/dist/full.css'; // Import DaisyUI styles
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { FirebaseProvider } from '../context/FirebaseContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </FirebaseProvider>
    </AuthProvider>
  );
}

export default MyApp;
