import React from 'react';
import Head from 'next/head';

const DataDeletionPolicy = () => {
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
          <title>Data Deletion Policy - SmartBookshelf.io</title>
          <meta name="description" content="Data Deletion Policy for SmartBookshelf.io"/>
        </Head>

        <div
            className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
          <h1 className="text-4xl font-bold text-white mb-6">Data Deletion Policy</h1>
          <div className="w-full text-white">
            <p className="mb-4">
              July 16, 2024
            </p>

            <p className="mb-4">
              At SmartBookshelf.io, we respect your right to privacy and provide you with the ability to delete your
              data.
            </p>

            <h2 className="text-2xl font-semibold mb-4">How to Delete Your Data</h2>
            <p className="mb-4">
              If you wish to delete your data, please contact us at rob@smartbreed.io with your request. We will process
              your request and confirm the deletion. This will involve deleting your user information and any associated
              data from our servers.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our data deletion policy, please contact me at rob@smartbreed.io.
            </p>
          </div>
        </div>
      </div>
  );
};

export default DataDeletionPolicy;
