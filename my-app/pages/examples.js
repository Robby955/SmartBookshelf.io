import React from 'react';
import Head from 'next/head';

const Examples = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>Examples - SmartBookshelf.io</title>
        <meta name="description" content="Examples of SmartBookshelf.io in action" />
      </Head>

      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Examples</h1>
        <p className="mb-6 text-gray-700">Here we will showcase images and results processed by SmartBookshelf.io.</p>
        {/* Add your images and results here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img src="public/IMG_6335.jpg" alt="Example 1" className="mb-4 rounded-lg" />
            <p className="text-gray-700">Example description 1</p>
          </div>
          {/* Add more examples as needed */}
        </div>
      </div>
    </div>
  );
};

export default Examples;
