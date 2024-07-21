import { useState } from 'react';
import EssayWriter from '../components/EssayWriter';
import SpellChecker from '../components/SpellChecker';
import AIDetector from '../components/AIDetector';
import PlagiarismDetector from '../components/PlagiarismDetector';


const Tools = () => {
  const [activeTool, setActiveTool] = useState('essayWriter');

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'essayWriter':
        return <EssayWriter />;
      case 'spellChecker':
        return <SpellChecker />;
      case 'aiDetector':
        return <AIDetector />;
      case 'plagiarismDetector':
        return <PlagiarismDetector />;
      default:
        return <EssayWriter />;
    }
  };

  return (

      <div className="min-h-screen flex flex-col items-center py-12" style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        color: "#ffffff"
      }}>
        <div className="container mx-auto p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Tools</h1>
          <p className="mb-6 text-white">
            Welcome to our comprehensive suite of tools designed to assist you with your writing and analysis needs.
            Each tool integrates advanced algorithms and AI capabilities to enhance your work. Please select a tool to
            get started.
          </p>
          <div className="tabs tabs-boxed mb-6">
            <a className={`tab ${activeTool === 'essayWriter' ? 'tab-active' : ''}`} onClick={() => setActiveTool('essayWriter')}>Essay Writer</a>
            <a className={`tab ${activeTool === 'spellChecker' ? 'tab-active' : ''}`} onClick={() => setActiveTool('spellChecker')}>Spell Checker</a>
            <a className={`tab ${activeTool === 'aiDetector' ? 'tab-active' : ''}`} onClick={() => setActiveTool('aiDetector')}>AI Detector</a>
            <a className={`tab ${activeTool === 'plagiarismDetector' ? 'tab-active' : ''}`} onClick={() => setActiveTool('plagiarismDetector')}>Plagiarism Detector</a>
          </div>
          <div className="w-full">
            {renderActiveTool()}
          </div>
        </div>
      </div>

  );
};

export default Tools;
