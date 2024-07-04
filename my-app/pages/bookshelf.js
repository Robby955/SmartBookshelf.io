import React from 'react';
import Head from 'next/head';

const Bookshelf = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>Bookshelf - SmartBookshelf.io</title>
        <meta name="description" content="Your personal bookshelf at SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">My Bookshelf</h1>
        <p className="text-white">This is where your books will be displayed.</p>
      </div>
    </div>
  );
};

export default Bookshelf;
