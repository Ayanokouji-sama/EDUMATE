import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, logout } from '../services/api/auth'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const data = await getProfile()
      setUser(data)
    } catch (err) {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Edumate</h1>
          <p className="text-sm text-gray-600 mt-1">AI Learning Companion</p>
        </div>

        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-xl">🏠</span>
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 ${
              activeTab === 'upload' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-xl">📤</span>
            <span className="font-medium">Upload Content</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 ${
              activeTab === 'library' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-xl">📚</span>
            <span className="font-medium">My Library</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 ${
              activeTab === 'tools' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-xl">🛠️</span>
            <span className="font-medium">AI Tools</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 ${
              activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.first_name || user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'home' && 'Dashboard'}
            {activeTab === 'upload' && 'Upload Content'}
            {activeTab === 'library' && 'My Library'}
            {activeTab === 'tools' && 'AI Tools'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
          <p className="text-gray-600 mt-1">
            {activeTab === 'home' && 'Welcome back! Here\'s your learning overview'}
            {activeTab === 'upload' && 'Upload text, images, or audio to start learning'}
            {activeTab === 'library' && 'All your study materials in one place'}
            {activeTab === 'tools' && 'AI-powered learning tools'}
            {activeTab === 'settings' && 'Manage your account and preferences'}
          </p>
        </div>

        <div className="p-6">
          {activeTab === 'home' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Content</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div className="text-4xl">📚</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Summaries</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div className="text-4xl">📝</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Questions</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div className="text-4xl">❓</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Translations</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">0</p>
                    </div>
                    <div className="text-4xl">🌍</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl mb-2">📭</p>
                  <p>No recent activity yet</p>
                  <p className="text-sm mt-2">Upload some content to get started!</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-lg hover:bg-blue-50 flex items-center gap-3">
                    <span className="text-2xl">📤</span>
                    <span className="font-medium">Upload Content</span>
                  </button>

                  <button className="border-2 border-gray-300 text-gray-600 px-6 py-4 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <span className="text-2xl">✍️</span>
                    <span className="font-medium">Paste Text</span>
                  </button>

                  <button className="border-2 border-gray-300 text-gray-600 px-6 py-4 rounded-lg hover:bg-gray-50 flex items-center gap-3">
                    <span className="text-2xl">🎤</span>
                    <span className="font-medium">Record Audio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Upload functionality coming soon...</p>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-2">📚</p>
                <p>Your library is empty</p>
                <p className="text-sm mt-2">Start uploading content to build your library</p>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Summarizer</h3>
                  <p className="text-gray-600 mb-4">Generate concise summaries from any text</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Use Tool
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-3xl mb-3">🌍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Translator</h3>
                  <p className="text-gray-600 mb-4">Translate content to multiple languages</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Use Tool
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-3xl mb-3">❓</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Question Generator</h3>
                  <p className="text-gray-600 mb-4">Create practice questions from your content</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Use Tool
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Proofreader</h3>
                  <p className="text-gray-600 mb-4">Check grammar and improve your writing</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Use Tool
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={user.first_name || user.username}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly/>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Offline Mode</span>
                    <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">Active</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Data Privacy</span>
                    <div className="bg-green-500 text-white px-3 py-1 rounded text-sm">Protected</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
