import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6">Edumate</h1>
          <p className="text-2xl mb-4">Your AI Learning Companion</p>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            Turn any content into study material. Upload text, images, or audio 
            and let AI help you learn better. Works offline, keeps your data private.
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <Link to="/login" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              Get Started
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600">
              Learn More
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
              <p className="text-sm">Upload text, images, PDFs, or audio files</p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Powered</h3>
              <p className="text-sm">Summarize, translate, generate questions</p>
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-sm">Everything runs on your device, no servers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
