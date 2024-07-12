import '../styles/globals.css'; // Import global styles first
import 'tailwindcss/tailwind.css'; // Import TailwindCSS styles
import 'daisyui/dist/full.css'; // Import DaisyUI styles
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
