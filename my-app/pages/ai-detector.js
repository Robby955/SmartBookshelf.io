import withAdmin from '../middleware/withAdmin';

const AIDetector = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">AI Detector</h1>
      <textarea className="input input-bordered w-full max-w-xs text-black"></textarea>
    </div>
  );
};

export default withAdmin(AIDetector);
