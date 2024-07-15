import React from 'react';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center py-12"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff",
      }}
    >
      <Head>
        <title>Privacy Policy - SmartBookshelf.io</title>
        <meta name="description" content="Privacy Policy for SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="w-full text-white">
          <p className="mb-4">July 16, 2024</p>

          <p className="mb-4">
            Welcome to SmartBookshelf.io! We value your privacy. Here’s what you need to know:
          </p>

          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            When you upload an image, we may save it and use it to improve the system or for analytics purposes. The image is also processed by our system to extract text from the book spines and saved on servers.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Your Consent</h2>
          <p className="mb-4">
            By using SmartBookshelf.io, you agree to this policy.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions, please contact me at rob@smartbreed.io.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
