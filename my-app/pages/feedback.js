import React from 'react';
import Head from 'next/head';

const Feedback = () => {
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
          <title>Feedback - SmartBookshelf.io</title>
          <meta name="description" content="Provide feedback for SmartBookshelf.io"/>
        </Head>

        <div
            className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
          <h1 className="text-4xl font-bold text-white mb-6">Feedback</h1>
          <form className="w-full max-w-md">
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Your Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Your Email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="message"
                  rows="5"
                  placeholder="Your Feedback"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Feedback;
