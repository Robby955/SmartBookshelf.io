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
        <meta name="description" content="Frequently asked questions about SmartBookshelf, bookshelf-photo input quality, and what the public repository contains." />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
          <div className="w-full">
              <h2 className="text-2xl font-semibold mb-2 text-white">How do I take a good photo?</h2>
              <p className="mb-6 text-white">
                  Keep the camera parallel to the shelf, use even lighting, and make sure the spine text is readable. One shelf level per photo usually works much better than a full-room shot.
              </p>
              <h2 className="text-2xl font-semibold mb-2 text-white">When should I use crop mode?</h2>
              <p className="mb-6 text-white">
                  Crop mode is best used as a fallback when you cannot retake the photo. It helps isolate a shelf section, but it also throws away resolution, so the cleaner option is still to retake the image when possible.
              </p>
              <h2 className="text-2xl font-semibold mb-2 text-white">Why does one shelf per photo matter so much?</h2>
              <p className="mb-6 text-white">
                  Spine text is narrow and easy to lose when the camera is too far away. Splitting a room into one shelf per image preserves detail, reduces glare problems, and gives the OCR stage a much better shot at clean text.
              </p>

              <h2 className="text-2xl font-semibold mb-2 text-white">What should I do if some titles are wrong?</h2>
              <p className="mb-6 text-white">
                  Treat the output as a reviewable catalog, not an untouchable final answer. The point is to save most of the manual work, then let you correct the misses that come from glare, dense shelves, or unreadable bindings.
              </p>

              <h2 className="text-2xl font-semibold mb-2 text-white">What does this public repository contain?</h2>
              <p className="mb-6 text-white">
                  This repo preserves the earlier public SmartBookshelf stack: the original Next.js prototype, the earlier Flask backend, and a small set of verified sample shelf images. The current production frontend lives in a newer repository.
              </p>
          </div>
      </div>
    </div>
  );
};

export default FAQ;
