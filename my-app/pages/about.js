import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12" style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      color: "#ffffff"
    }}>
      <Head>
        <title>About - SmartBookshelf.io</title>
        <meta name="description" content="Learn more about SmartBookshelf.io"/>
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">About</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
          <p className="mb-6 text-white">
            At SmartBookshelf.io, our mission is to make it easier for book owners to catalog and organize their
            personal libraries for personal use or for sale/cataloging purposes by utilizing state-of-the-art machine learning
            technologies. We believe in leveraging technology to solve everyday problems and improve the way we
            interact with our collections. Users can also form personal documents and form personal collections with
            the ability to create or remove books from the list. An algorithm is in development that attempts to match
            each extracted text with a book in the database.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Our Technology</h2>
          <p className="mb-6 text-white">
            SmartBookshelf.io uses a combination of Optical Character Recognition (OCR) and machine learning to detect
            and extract text from book spines. Here&apos;s a breakdown of our technology stack:
          </p>
          <ul className="list-disc list-inside mb-6 text-white">
            <li><strong>Frontend:</strong> We use React, Next.js, Tailwind CSS, and DaisyUI to build a responsive and
              user-friendly interface.
            </li>
            <li><strong>Backend:</strong> Our backend is powered by Python and Flask, providing fast and reliable
              endpoints for image processing and text extraction.
            </li>
            <li><strong>OCR:</strong> We utilize Google Cloud Vision API and Tesseract OCR to accurately detect and
              extract text from images of book spines.
            </li>
            <li><strong>Machine Learning:</strong> Our system uses YOLO (You Only Look Once) for real-time object
              detection, ensuring that we accurately identify and crop book spines from uploaded images.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white">Advanced Features in Progress</h2>
          <ul className="list-disc list-inside mb-6 text-white">
            <li><strong>AI Detector:</strong> An upcoming feature to detect AI-generated text within book descriptions and analyses.</li>
            <li><strong>Plagiarism Detector:</strong> A feature to ensure the originality of the text by detecting plagiarism in essays and other writings.</li>
            <li><strong>Essay Writer:</strong> Generate essays based on selected books with customizable formats, styles, and keyword focuses.</li>
            <li><strong>Spell Checker:</strong> An advanced spell checker that helps refine and correct your writing.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white mt-12">Frequently Asked Questions</h2>
          <h3 className="text-xl font-semibold mb-2 text-white">What is SmartBookshelf.io?</h3>
          <p className="mb-6 text-white">
            SmartBookshelf.io is a web application that allows you to upload images of your bookshelf and extract text
            from the book spines using OCR (Optical Character Recognition) technology.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-white">How do I use SmartBookshelf.io?</h3>
          <p className="mb-6 text-white">
            Simply upload an image of your bookshelf, and our application will detect the books and extract the titles
            for you. An algorithm is in development that will automatically detect the books and extract additional
            information for you.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-white">What technologies are used in SmartBookshelf.io?</h3>
          <p className="mb-6 text-white">
            SmartBookshelf.io uses modern web technologies such as React, Next.js, Tailwind CSS, and DaisyUI for the
            front end. The backend is powered by Python, Flask, and various OCR libraries.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-white">How can I ensure the best results when uploading images?</h3>
          <p className="mb-6 text-white">
            Ensure your photo is well-lit, in focus, and that book titles are clearly visible. It is best to separate
            books of the same size or color as they may blend into one otherwise.
          </p>

          <h3 className="text-xl font-semibold mb-2 text-white">What if the book titles are not detected accurately?</h3>
          <p className="mb-6 text-white">
            You can manually adjust any incorrect book titles after the analysis. We are working on improving the
            accuracy of our system.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Crop Feature</h2>
          <p className="mb-6 text-white">
            The crop feature allows you to select specific areas of your uploaded images to focus on. This is particularly useful if the image contains multiple books and you want to refine the detection process. Simply upload an image, use the cropping tool to select the desired areas, and then click &quot;Add Crop&quot; to save your selection. You can add multiple crops if needed.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimer</h2>
          <p className="mb-6 text-white">
            SmartBookshelf.io is a project in development, and while we strive to provide accurate and efficient results, there may be inaccuracies in text detection and extraction. For images with
            poor cropping, bad lighting or tons of books, the results returned by the system may not be accurate. However, it should give you a rough estimate on at least the number of books regardless. We appreciate your understanding and welcome any feedback to help us improve the system.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Get in Touch</h2>
          <p className="text-white">
            If you have any questions, feedback, or suggestions, feel free to reach
            out using the <Link href="/feedback" legacyBehavior><a className="text-blue-500 underline">feedback form</a></Link>. You can also reach me at rob@smartbookshelf.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
