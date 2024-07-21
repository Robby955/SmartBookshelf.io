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
            At SmartBookshelf.io, we&apos;re focused on simplifying the process of cataloging and organizing personal libraries. Whether you&apos;re managing your books for personal use, preparing for sale, or keeping track of textbooks for college, our advanced machine learning technologies can help. Our platform allows you to create and manage personal collections, easily add or remove books,
            and organize your documents. Our LLM algorithm then works to match each extracted text with a book in our database, making your book management more efficient and streamlined.
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

          <h2 className="text-2xl font-semibold mb-4 text-white">Other Features in Progress</h2>
          <ul className="list-disc list-inside mb-6 text-white">
            <li><strong>AI Detector:</strong> An upcoming feature to detect AI-generated text within book descriptions
              and analyses.
            </li>
            <li><strong>Plagiarism Detector:</strong> A feature to ensure the originality of the text by detecting
              plagiarism in essays and other writings.
            </li>
            <li><strong>Essay Writer:</strong> Generate essays based on selected books with customizable formats,
              styles, and keyword focuses.
            </li>
            <li><strong>GPU support:</strong> Integrate a GPU to speed up the process for all users.</li>
            <li><strong>Async updates:</strong> Improve the speed of the algorithm by fully utilizing caching and preloading of predictions. </li>
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

          <h2 className="text-2xl font-semibold mb-4 text-white">Known Bugs</h2>
          <p className="mb-6 text-white">
            We are currently aware of an issue where the color of the cropped book spines may not match the original image. This is a known bug and we are working on a fix. We appreciate your patience and understanding as we work to resolve this issue.
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
