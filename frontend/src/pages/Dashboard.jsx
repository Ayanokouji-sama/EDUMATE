import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Upload from './Upload';
import Library from './Library';
import Settings from './Settings';
import { getAllContent } from '../services/api/indexedDB';

function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({
    total: 0,
    summaries: 0,
    questions: 0,
    proofread: 0,
    simplified: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'home';
    setActiveTab(path);
    
    if (path === 'home' || path === '') {
      loadStats();
    }
  }, [location]);

  const loadStats = async () => {
    try {
      const allContent = await getAllContent();
      
      setStats({
        total: allContent.length,
        summaries: allContent.filter(i => i.type === 'summarize').length,
        questions: allContent.filter(i => i.type === 'questions').length,
        proofread: allContent.filter(i => i.type === 'proofread').length,
        simplified: allContent.filter(i => i.type === 'simplify').length
      });

      const recent = allContent
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
      setRecentActivity(recent);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const renderTabHeader = () => {
    const headers = {
      home: 'Welcome back! Here\'s your learning overview',
      upload: 'Upload text, images, or audio to start learning',
      library: 'All your study materials in one place',
      settings: 'App preferences'
    };
    return headers[activeTab] || 'Dashboard';
  };

  const getIcon = (type) => {
    const icons = {
      summarize: '📝',
      simplify: '✨',
      proofread: '✅',
      questions: '❓'
    };
    return icons[type] || '📄';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Edumate</h1>
          <p className="text-sm text-gray-600">AI Learning Companion</p>
        </div>

        <nav className="mt-6">
          <Link
            to="/dashboard"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              activeTab === 'home' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
            }`}
          >
            🏠 Home
          </Link>

          <Link
            to="/dashboard/upload"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              activeTab === 'upload' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
            }`}
          >
            📤 Upload Content
          </Link>

          <Link
            to="/dashboard/library"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              activeTab === 'library' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
            }`}
          >
            📚 My Library
          </Link>

          <Link
            to="/dashboard/settings"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
            }`}
          >
            ⚙️ Settings
          </Link>
        </nav>
      </div>
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">{renderTabHeader()}</h1>
        <Routes>
          <Route path="/" element={
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-600 text-sm mb-1">Total Content</div>
                  <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-600 text-sm mb-1">Summaries</div>
                  <div className="text-3xl font-bold text-blue-600">{stats.summaries}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-600 text-sm mb-1">Questions</div>
                  <div className="text-3xl font-bold text-orange-600">{stats.questions}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-gray-600 text-sm mb-1">Proofread</div>
                  <div className="text-3xl font-bold text-green-600">{stats.proofread}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent activity yet</p>
                    <p className="text-sm mt-2">Upload some content to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getIcon(item.type)}</span>
                          <div>
                            <div className="font-medium text-gray-800">
                              {item.title || 'Untitled'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.type} • {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          } />
          <Route path="/upload" element={<Upload />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
