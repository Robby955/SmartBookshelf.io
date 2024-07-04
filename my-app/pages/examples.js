import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Examples = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>Examples - SmartBookshelf.io</title>
        <meta name="description" content="Examples of how to use SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Examples</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Example 1: Uploading a Bookshelf Image</h2>
          <p className="mb-6 text-white">
            Upload an image of your bookshelf, and our application will detect the books and extract the titles for you.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden">
            <Image src="/example1.png" alt="Example 1" layout="fill" objectFit="contain" />
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 2: Extracted Book Titles</h2>
          <p className="mb-6 text-white">
            Here are the titles that were extracted from the uploaded image.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden">
            <Image src="/example2.png" alt="Example 2" layout="fill" objectFit="contain" />
          </div>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden">
            <Image src="/example3.png" alt="Example 3" layout="fill" objectFit="contain" />
          </div>

          {/* Additional examples can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Examples;
