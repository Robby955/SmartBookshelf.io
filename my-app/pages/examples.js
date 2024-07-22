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
        <meta name="description" content="Examples of how to use SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Examples</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Instructional Video</h2>
          <p className="mb-6 text-white">
            Watch this video to see a step-by-step guide on how to use SmartBookshelf.io.
          </p>
          <div className="w-full h-auto mb-4 border rounded-lg overflow-hidden">
            <video width="100%" controls>
              <source src="https://storage.googleapis.com/demovideos-smartshelf/siteinstructions.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 1: Uploading a Bookshelf Image</h2>
          <p className="mb-6 text-white">
            Upload an image of your bookshelf, and our application will detect the books and extract the titles for you.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example1.png')}>
            <Image src="/example1.png" alt="An example of a good image loaded" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 2: When to Use Crop Mode</h2>
          <p className="mb-6 text-white">
            Use crop mode if your bookshelves have vertical levels of shelves. Cropping should ONLY be used for cropping vertical shelves, never to break up a horizontal shelf, otherwise the model could lose context for that row and get the books wrong.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/whentousecrop.jpg')}>
            <Image src="/whentousecrop.jpg" alt="When to use crop mode" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 3: Extracting Text from Book Spines</h2>
          <p className="mb-6 text-white">
            Upload an image of your bookshelf and our application will extract the titles from the book spines.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example2.png')}>
            <Image src="/example2.png" alt="Example 2" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 4: Image with 16 Books</h2>
          <p className="mb-6 text-white">
            This example shows an image with 16 books detected and extracted.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example7.png')}>
            <Image src="/example7.png" alt="Example 7" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 5: Drop Down Example</h2>
          <p className="mb-6 text-white">
            This example shows the dropdown functionality to select extracted book titles.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example8.png')}>
            <Image src="/example8.png" alt="Example 8" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 6: Multiple Shelves</h2>
          <p className="mb-6 text-white">
            This example shows how users can analyze multiple shelves at once.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example9.png')}>
            <Image src="/example9.png" alt="Example 9" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 7: User Page</h2>
          <p className="mb-6 text-white">
            The user page allows users to view and edit their virtual bookcase, as well as export to CSV and use generative AI to analyze their results.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example10.png')}>
            <Image src="/example10.png" alt="User Page" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 8: GPT Response</h2>
          <p className="mb-6 text-white">
            GPT assisted response to the extracted text from the book spines.
          </p>
          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example14.jpg')}>
            <Image src="/example14.jpg" alt="GPT assisted response" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <div className="relative w-full h-auto mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example22.jpg')}>
            <Image src="/example22.jpg" alt="GPT corrected title" layout="responsive" width={1000} height={600} objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Cropping Example Video</h2>
          <p className="mb-6 text-white">
            Watch this video to see how to crop and select specific sections of a bookcase.
          </p>
          <div className="w-full h-auto mb-4 border rounded-lg overflow-hidden">
            <video width="100%" controls>
              <source src="https://storage.googleapis.com/demovideos-smartshelf/cropexample.mp4" type="video/mp4" />
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
          <Image src={modalImage} alt="Example" layout="responsive" width={1000} height={800} objectFit="contain" />
          <button onClick={closeModal} className="absolute top-4 right-4 text-white text-2xl font-bold bg-transparent border-none cursor-pointer">
            &times;
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Examples;
