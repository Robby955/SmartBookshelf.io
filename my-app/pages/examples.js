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
          <h2 className="text-2xl font-semibold mb-4 text-white">Example 1: Uploading a Bookshelf Image</h2>
          <p className="mb-6 text-white">
            Upload an image of your bookshelf, and our application will detect the books and extract the titles for you.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example1.png')}>
            <Image src="/example1.png" alt="Example 1" layout="fill" objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 2:</h2>
          <p className="mb-6 text-white">
            Here is another example of how to use SmartBookshelf.io. You can upload an image of your bookshelf and
            extract the titles from the book spines.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example2.png')}>
            <Image src="/example2.png" alt="Example 2" layout="fill" objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 3:</h2>
          <p className="mb-6 text-white">
            Another example showing the functionality of SmartBookshelf.io.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example3.png')}>
            <Image src="/example3.png" alt="Example 3" layout="fill" objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 4: Image with 16 Books</h2>
          <p className="mb-6 text-white">
            This example shows an image with 16 books detected and extracted.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example7.png')}>
            <Image src="/example7.png" alt="Example 7" layout="fill" objectFit="contain"/>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 5: Drop Down Example</h2>
          <p className="mb-6 text-white">
            This example shows the dropdown functionality to select extracted book titles.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example8.png')}>
            <Image src="/example8.png" alt="Example 8" layout="fill" objectFit="contain"/>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Example 6: Multiple Shelves</h2>
          <p className="mb-6 text-white">
            This example shows how users can analyze multiple shelves at once.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example9.png')}>
            <Image src="/example9.png" alt="Example 6" layout="fill" objectFit="contain"/>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Example 6: Multiple Shelves</h2>
          <p className="mb-6 text-white">
            The user page allows users to view and edit their virtual bookcase, as well as export to CSV and use generative AI to analyze their results.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer"
               onClick={() => openModal('/example10.png')}>
            <Image src="/example10.png" alt="Example 7" layout="fill" objectFit="contain"/>
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
        <Image src={modalImage} alt="Example" layout="responsive" width={800} height={600} objectFit="contain" />
          <button onClick={closeModal} className="absolute top-4 right-4 text-white text-2xl font-bold bg-transparent border-none cursor-pointer">
            &times;
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Examples;
