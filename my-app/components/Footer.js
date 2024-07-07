import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 SmartBookshelf.io. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="/feedback" legacyBehavior>
            <a className="text-white">Feedback</a>
          </Link>
          <Link href="/privacy-policy" legacyBehavior>
            <a className="text-white">Privacy Policy</a>
          </Link>
          <Link href="/data-deletion-policy" legacyBehavior>
            <a className="text-white">Data Deletion Policy</a>
          </Link>
          <Link href="/terms-of-service" legacyBehavior>
            <a className="text-white">Terms of Service</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
