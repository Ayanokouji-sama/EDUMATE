import { useState } from 'react';
import Upload from '../pages/Upload';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTabHeader = () => {
    switch (activeTab) {
      case 'home':
        return "Welcome back! Here's your learning overview";
      case 'upload':
        return "Upload text, images, or audio to start learning";
      case 'library':
        return "All your study materials in one place";
      case 'tools':
        return "AI-powered learning tools";
      case 'settings':
        return "App preferences";
      default:
        return "Welcome!";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-6 border-b">
          <span className="font-bold text-xl text-indigo-600">Edumate</span>
          <div className="text-sm text-gray-400 mt-1">AI Learning Companion</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            className={`block w-full text-left py-2 px-3 rounded transition ${activeTab === 'home' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`block w-full text-left py-2 px-3 rounded transition ${activeTab === 'upload' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Content
          </button>
          <button
            className={`block w-full text-left py-2 px-3 rounded transition ${activeTab === 'library' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('library')}
          >
            My Library
          </button>
          <button
            className={`block w-full text-left py-2 px-3 rounded transition ${activeTab === 'tools' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('tools')}
          >
            AI Tools
          </button>
          <button
            className={`block w-full text-left py-2 px-3 rounded transition ${activeTab === 'settings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        {/* Remove user info and logout */}
      </aside>

      <main className="flex-1 p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700">{renderTabHeader()}</h2>
        </div>

        {activeTab === 'home' && (
          <section>
            <div className="flex flex-row gap-8 mb-8">
              <div className="flex-1 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                <div className="text-gray-500 mb-2">Total Content</div>
                <div className="font-bold text-3xl text-indigo-600">0</div>
              </div>
              <div className="flex-1 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                <div className="text-gray-500 mb-2">Summaries</div>
                <div className="font-bold text-3xl text-indigo-600">0</div>
              </div>
              <div className="flex-1 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                <div className="text-gray-500 mb-2">Questions</div>
                <div className="font-bold text-3xl text-indigo-600">0</div>
              </div>
              <div className="flex-1 bg-white shadow rounded-lg p-6 flex flex-col items-center">
                <div className="text-gray-500 mb-2">Translations</div>
                <div className="font-bold text-3xl text-indigo-600">0</div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-8 text-gray-600 text-center">
              <div className="mb-2 font-medium">Recent Activity</div>
              <div className="text-sm text-gray-400">
                No recent activity yet <br /> Upload some content to get started!
              </div>
            </div>
          </section>
        )}

        {activeTab === 'upload' && (
          <section>
            <Upload />
          </section>
        )}

        {activeTab === 'library' && (
          <section>
            <div className="bg-white shadow rounded-lg p-8 text-center text-gray-600">
              <div className="mb-4 font-semibold text-lg">Your library is empty</div>
              <div className="text-sm text-gray-400">Start uploading content to build your library</div>
            </div>
          </section>
        )}

        {activeTab === 'tools' && (
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-8">
                <div className="font-semibold mb-2">Summarize</div>
                <div className="text-sm text-gray-500">
                  Generate concise summaries from any text
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-8">
                <div className="font-semibold mb-2">Translate</div>
                <div className="text-sm text-gray-500">
                  Translate content to multiple languages
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-8">
                <div className="font-semibold mb-2">Generate Questions</div>
                <div className="text-sm text-gray-500">
                  Create practice questions from your content
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-8">
                <div className="font-semibold mb-2">Proofread</div>
                <div className="text-sm text-gray-500">
                  Check grammar and improve your writing
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section>
            <div className="bg-white shadow rounded-lg p-8">
              <div className="font-semibold mb-2">Settings</div>
              <div className="text-sm text-gray-500">
                App preferences and offline data options will go here.
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
