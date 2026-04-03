import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p>&copy; 2024-2026 SmartBookshelf.io.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="/feedback" legacyBehavior>
            <a style={{fontSize: '14px', color: 'white'}}>Feedback</a>
          </Link>
          <Link href="/faq" legacyBehavior>
            <a className="text-white">FAQ</a>
          </Link>
          <Link href="/privacy-policy" legacyBehavior>
            <a className="text-white">Privacy Policy</a>
          </Link>
          <Link href="/data-deletion-policy" legacyBehavior>
            <a className="text-white">Data Deletion</a>
          </Link>
          <Link href="/terms-of-service" legacyBehavior>
            <a className="text-white">Terms of Service</a>
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-300">
          Public snapshot of the earlier SmartBookshelf prototype and bookshelf-scanning pipeline.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
