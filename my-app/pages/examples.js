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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center py-12">
      <Head>
        <title>Examples - SmartBookshelf.io</title>
        <meta name="description" content="Examples of how to use SmartBookshelf.io" />
      </Head>

      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Examples</h1>
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-white">Example: Uploading a Bookshelf Image</h2>
          <p className="mb-6 text-white">
            Upload an image of your bookshelf, and our application will detect the books and extract the titles for you.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer" onClick={() => openModal('/example1.png')}>
            <Image src="/example1.png" alt="Example 1" layout="fill" objectFit="contain" />
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-white">Example 2:</h2>
          <p className="mb-6 text-white">
            Here is another example of how to use SmartBookshelf.io. You can upload an image of your bookshelf and extract the titles from the book spines.
          </p>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer" onClick={() => openModal('/example2.png')}>
            <Image src="/example2.png" alt="Example 2" layout="fill" objectFit="contain" />
          </div>
          <div className="relative w-full h-64 mb-4 border rounded-lg overflow-hidden cursor-pointer" onClick={() => openModal('/example3.png')}>
            <Image src="/example3.png" alt="Example 3" layout="fill" objectFit="contain" />
          </div>

          {/* Additional examples can be added here */}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Image"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
          content: { border: 'none', background: 'none', padding: 'none' }
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
