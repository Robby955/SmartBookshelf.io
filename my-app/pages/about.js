// my-app/pages/about.js

import React from 'react';
import Head from 'next/head';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>About Us - SmartBookshelf.io</title>
        <meta name="description" content="Learn more about the team and technology behind SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-dark rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">About Us</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
          <p className="mb-6 text-white"> At SmartBookshelf.io, our mission is to make it easier for book owners to catalog and organize their personal libraries for personal use or for sale/catalog using state-of-the-art machine learning technologies. We believe in leveraging technology to solve everyday problems and improve the way we interact with our collections.
          Users can also form personal documents and form personal collections with the ability to create or remove books from the list. An algorithm is in development that attempts to match each extracted text with a book in the database.</p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Our Technology</h2>
          <p className="mb-6 text-white">SmartBookshelf.io uses a combination of Optical Character Recognition (OCR) and machine learning to detect and extract text from book spines. Here&apos;s a breakdown of our technology stack:</p>
          <ul className="list-disc list-inside mb-6 text-white">
            <li><strong>Frontend:</strong> We use React, Next.js, Tailwind CSS, and DaisyUI to build a responsive and user-friendly interface.</li>
            <li><strong>Backend:</strong> Our backend is powered by Python and FastAPI, providing fast and reliable endpoints for image processing and text extraction.</li>
            <li><strong>OCR:</strong> We utilize Google Cloud Vision API and Tesseract OCR to accurately detect and extract text from images of book spines.</li>
            <li><strong>Machine Learning:</strong> Our system uses YOLO (You Only Look Once) for real-time object detection, ensuring that we accurately identify and crop book spines from uploaded images.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white">Our Team</h2>
          <p className="mb-6 text-white">We are a team of passionate developers, data scientists, and book lovers committed to creating innovative solutions for everyday challenges.</p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Get in Touch</h2>
          <p className="text-white">If you have any questions, feedback, or suggestions, we&apos;d love to hear from you! Feel free to reach out to us at <a href="mailto:contact@smartbookshelf.io" className="text-blue-600 hover:underline">contact@smartbookshelf.io</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
