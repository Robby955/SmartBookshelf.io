import React from 'react';
import Head from 'next/head';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>FAQ - SmartBookshelf.io</title>
        <meta name="description" content="Frequently Asked Questions about SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-dark rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">What is SmartBookshelf.io?</h2>
          <p className="mb-6 text-white">SmartBookshelf.io is a web application that allows you to upload images of your bookshelf and extract text from the book spines using OCR (Optical Character Recognition) technology.</p>

          <h2 className="text-2xl font-semibold mb-4 text-white">How do I use SmartBookshelf.io?</h2>
          <p className="mb-6 text-white">Simply upload an image of your bookshelf, and our application will detect the books and extract the titles for you. You can then select a book title to get more information about the book.</p>

          <h2 className="text-2xl font-semibold mb-4 text-white">What technologies are used in SmartBookshelf.io?</h2>
          <p className="mb-6 text-white">SmartBookshelf.io uses modern web technologies such as React, Next.js, Tailwind CSS, and DaisyUI for the front end. The backend is powered by Python, FastAPI, and various OCR libraries.</p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Is my data safe?</h2>
          <p className="mb-6 text-white">Yes, your data is safe with us. We do not store any images or extracted text on our servers. All processing is done in real-time and the data is not stored after the session ends.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
