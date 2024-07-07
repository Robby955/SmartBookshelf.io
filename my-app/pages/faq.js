import React from 'react';

const FAQ = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <h2 className="text-2xl font-semibold mb-2">How do I take a good photo?</h2>
      <p>Ensure your photo is well-lit, in focus, and that book titles are clearly visible. It is best to separate books of the same size or color as they may blend into one otherwise.</p>
      <h2 className="text-2xl font-semibold mb-2">Why can&#39;t I upload large photos?</h2>
      <p>Our system is currently in development and may not handle very large images well. Try taking multiple smaller photos for better results. Make sure there are not other items in the photo.</p>
      <h2 className="text-2xl font-semibold mb-2">What should I do if the app doesn&#39;t detect all books correctly?</h2>
      <p>You can manually adjust any incorrect book titles after the analysis. We are working on improving the accuracy of our system.</p>
    </div>
  );
};

export default FAQ;
