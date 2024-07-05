import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 SmartBookshelf.io. All rights reserved.</p>
        <Link href="/feedback" legacyBehavior>
          <a className="text-white">Feedback</a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
