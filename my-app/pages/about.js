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
        <meta name="description" content="Background on the earlier SmartBookshelf prototype, bookshelf OCR pipeline, and practical photo capture guidance."/>
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">About SmartBookshelf</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">What the project is</h2>
          <p className="mb-6 text-white">
            SmartBookshelf started as a practical computer-vision project for turning bookshelf photos into reviewable book lists. The goal was never to build a generic AI wrapper. The hard part is the perception pipeline: finding thin book spines, pulling messy text out of angled shelf photos, and cleaning that text into titles that a real person can use.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">What this public repo shows</h2>
          <p className="mb-6 text-white">
            This repository is the earlier public SmartBookshelf codebase. It shows the original end-to-end stack:
          </p>
          <ul className="list-disc list-inside mb-6 text-white">
            <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS, and DaisyUI for the original product prototype.</li>
            <li><strong>Backend:</strong> Flask endpoints for upload handling, image processing, and storage plumbing.</li>
            <li><strong>Detection:</strong> YOLO-based book detection to isolate likely spine regions before OCR.</li>
            <li><strong>OCR:</strong> Google Cloud Vision plus supporting heuristics to extract noisy spine text.</li>
            <li><strong>Storage:</strong> Google Cloud Storage and Firestore for uploads, crops, and saved user data.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white">Why bookshelf photos are difficult</h2>
          <p className="mb-6 text-white">
            Bookshelf images are a rough OCR input. Spine text is narrow, often vertical, partly blocked, low contrast, and sensitive to glare. Similar-looking bindings also make detection harder. That is why SmartBookshelf treats a shelf photo like a structured computer-vision problem rather than a flat document scan.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Good use cases</h2>
          <p className="mb-6 text-white">
            The project is useful for personal library cleanup, inventorying shelves before a move, organizing research or office books, preparing books for sale, and building a searchable reading record without typing every title by hand.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Best input practices</h2>
          <p className="mb-6 text-white">
            The best results come from one shelf level per photo, a camera angle parallel to the shelf, and readable spine text with low glare. Crop mode is a fallback when you cannot retake the photo, not the ideal path.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">Project status</h2>
          <p className="mb-6 text-white">
            The live site has moved beyond this older snapshot, but this repository is still useful if you want to understand the original frontend and backend architecture. The current production-facing frontend lives in a separate repository, while this one preserves the earlier public build.
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
