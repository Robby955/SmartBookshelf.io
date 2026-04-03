import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Modal from 'react-modal';

const Examples = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed", backgroundPosition: "center", color: "#ffffff" }}>
      <Head>
        <title>Examples - SmartBookshelf.io</title>
        <meta name="description" content="Real SmartBookshelf examples showing shelf inputs, crop mode, extracted text, and cleanup output." />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Examples</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Walkthrough Video</h2>
          <p className="mb-6 text-white">
            This walkthrough shows the original product flow from upload through review.
          </p>
          <div className="w-full h-auto mb-4 border rounded-lg overflow-hidden">
            <video width="100%" controls>
              <source src="https://storage.googleapis.com/demovideos-smartshelf/siteinstructions.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 1: A Good Shelf Input</h2>
          <p className="mb-6 text-white">
            A straight-on, readable shelf photo gives the system the best chance of finding spine regions and extracting usable text.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/examplemain.jpg')}>
            <Image src="/examplemain.jpg" alt="An example of a good image loaded" layout="responsive" width={1000}
                   height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 2: Crop Mode as a Fallback</h2>
          <p className="mb-6 text-white">
            Crop mode is useful when you cannot retake the image. It helps isolate a shelf section, but it usually lowers accuracy because you lose resolution. When possible, take one high-resolution photo per shelf instead.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/whentousecrop.jpg')}>
            <Image src="/whentousecrop.jpg" alt="When to use crop mode" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 3: Extracted Spine Text</h2>
          <p className="mb-6 text-white">
            Once the detector isolates book regions, the OCR stage produces rough text for each spine. The raw output is not always pretty, but it gives the matching stage something useful to work with.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example2.png')}>
            <Image src="/example2.png" alt="Example 2" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 4: Dense Shelf Result</h2>
          <p className="mb-6 text-white">
            This example shows a denser shelf where multiple titles still need to be separated, read, and returned as reviewable results.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example7.png')}>
            <Image src="/example7.png" alt="Example 7" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 5: Review and Correction UI</h2>
          <p className="mb-6 text-white">
            The important product decision was to return a reviewable list, not pretend the OCR stage would always be perfect on the first pass.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example8.png')}>
            <Image src="/example8.png" alt="Example 8" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 6: Multiple Shelf Uploads</h2>
          <p className="mb-6 text-white">
            Users can upload several shelf images in one session instead of trying to fit an entire room into one photo.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example9.png')}>
            <Image src="/example9.png" alt="Example 9" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 7: Saved Library View</h2>
          <p className="mb-6 text-white">
            After a scan, users can review saved titles, edit the misses, export data, and keep a lightweight digital shelf record.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example10.png')}>
            <Image src="/example10.png" alt="User Page" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 8: Title Cleanup and Matching</h2>
          <p className="mb-6 text-white">
            These examples show the cleanup step taking rough OCR fragments and turning them into cleaner candidate titles that are easier to review.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example14.jpg')}>
            <Image src="/example14.jpg" alt="Title cleanup output" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>
          <p className="mb-6 text-white">
            This screenshot shows the difference between noisy extracted text and a cleaner matched title candidate.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example22.jpg')}>
            <Image src="/example22.jpg" alt="Matched title example" layout="responsive" width={1000} height={600}
                   objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Cropping Example Video</h2>
          <p className="mb-6 text-white">
            This short clip shows how the older crop workflow worked in the prototype.
          </p>
          <div className="w-full h-auto mb-4 border rounded-lg overflow-hidden">
            <video width="100%" controls>
              <source src="https://storage.googleapis.com/demovideos-smartshelf/cropexample.mp4" type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Image"
          className="flex items-center justify-center h-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
          style={{
            overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)'},
            content: {border: 'none', background: 'none', padding: 'none'}
          }}
      >
        <div className="relative w-full max-w-4xl h-auto">
          <Image src={modalImage} alt="Example" layout="responsive" width={1000} height={800} objectFit="contain"/>
          <button onClick={closeModal}
                  className="absolute top-4 right-4 text-white text-2xl font-bold bg-transparent border-none cursor-pointer">
            &times;
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Examples;
