import React from 'react';
import Head from 'next/head';

const TermsOfService = () => {
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
        <title>Terms of Service - SmartBookshelf.io</title>
        <meta name="description" content="Terms of Service for SmartBookshelf.io"/>
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
        <div className="w-full text-white">
          <p className="mb-4">
            July 16, 2024
          </p>

          <h2 className="text-2xl font-semibold mb-4">Welcome to SmartBookshelf.io!</h2>
          <p className="mb-4">
            By using our website, you agree to these terms.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Use of Our Service</h2>
          <p className="mb-4">
            You agree to use SmartBookshelf.io responsibly. You agree to manually use the webpage and not use
            automated tools or scripts to access the webpage. You may not use this service to cheat at school or on tests. Our tool is designed to assist and inspire, providing ideas and insights, not to facilitate cheating.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Image Uploads</h2>
          <p className="mb-4">
            By uploading images, you agree that we may save and use these images to improve our system or for
            analytics purposes.
          </p>

          <h2 className="text-2xl font-semibold mb-4">No Commercial Use</h2>
          <p className="mb-4">
            You may not use SmartBookshelf.io for any commercial purposes without our permission.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
          <p className="mb-4">
            We may update our terms from time to time.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these terms, please contact me at rob@smartbookshelf.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
