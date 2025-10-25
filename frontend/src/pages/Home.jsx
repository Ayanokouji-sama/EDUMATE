import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">Edumate</h1>
      <p className="mb-6 text-lg text-gray-700">
        Your AI Learning Companion
      </p>

      <div className="bg-white shadow p-6 rounded-md w-full max-w-lg mb-8">
        <ul className="list-disc list-inside mb-4 text-gray-600 space-y-2">
          <li>Turn any content into study material. Upload text, images, or audio and let AI help you learn better. Works offline, keeps your data private.</li>
          <li>Upload textfiles, copy paste texts, or PDFs</li>
          <li>Summarize, translate, simplify and generate QnAs</li>
          <li>Everything runs on your device, no servers needed</li>
        </ul>
        <button
          className="w-full py-3 px-6 bg-indigo-600 text-white text-lg rounded hover:bg-indigo-700 transition"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>

      <div className="text-sm text-gray-400 mt-8">
        © {new Date().getFullYear()} Edumate | Offline AI for Learning
      </div>
    </div>
  );
}

export default Home;