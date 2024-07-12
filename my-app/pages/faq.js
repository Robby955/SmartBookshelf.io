import React from 'react';
import Head from 'next/head';

const FAQ = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center py-12"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff"
      }}
    >
      <Head>
        <title>FAQ - SmartBookshelf.io</title>
        <meta name="description" content="Frequently Asked Questions about SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
          <div className="w-full">
              <h2 className="text-2xl font-semibold mb-2 text-white">How do I take a good photo?</h2>
              <p className="mb-6 text-white">
                  Ensure your photo is well-lit, in focus, and that book titles are clearly visible. It is best to
                  separate
                  books of the same size or color as they may blend into one otherwise.
              </p>
              <h2 className="text-2xl font-semibold mb-2 text-white">Why can&apos;t I upload large photos?</h2>
              <p className="mb-6 text-white">
                  Our system is currently in development and may not handle very large images well. Try taking multiple
                  smaller photos for better results. Make sure there are not other items in the photo. Try to ensure it
                  is one &apos;shelf&apos; per photo instead of multi-level shelves. For multi-level shelves, upload an
                  image for each shelf.
              </p>
              <h2 className="text-2xl font-semibold mb-2 text-white">What should I do if the app doesn&apos;t detect all
                  books correctly?</h2>
              <p className="mb-6 text-white">
                  You can manually adjust any incorrect book titles after the analysis. We are working on improving the
                  accuracy of our system.
              </p>

              <h2 className="text-2xl font-semibold mb-2 text-white">What are the other features?</h2>
              <p className="mb-6 text-white">
                  You can automatically organize your virtual bookshelf, export the results to a csv file, and even use generative AI to analyze your results.
                  In progress is a feature that will assist in essay writing or book reports for certain books.
              </p>
          </div>
      </div>
    </div>
  );
};

export default FAQ;
