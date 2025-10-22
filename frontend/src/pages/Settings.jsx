import { useState, useEffect } from 'react';
import { getAllContent } from '../services/api/indexedDB';

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [exportLoading, setExportLoading] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    console.log('Theme changing to:', newTheme); // Debug log
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    console.log('Dark class now:', document.documentElement.classList.contains('dark')); // Debug log
  };

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      const allContent = await getAllContent();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalItems: allContent.length,
        content: allContent
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edumate-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear ALL your data? This cannot be undone!')) {
      if (window.confirm('This will delete everything. Are you REALLY sure?')) {
        try {
          const request = indexedDB.deleteDatabase('EdumateDB');
          request.onsuccess = () => {
            alert('All data cleared successfully');
            window.location.reload();
          };
          request.onerror = () => {
            alert('Failed to clear data');
          };
        } catch (error) {
          console.error('Error clearing data:', error);
          alert('Failed to clear data');
        }
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-6">

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => handleThemeChange('auto')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  theme === 'auto'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                🔄 Auto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Data Management
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Download all your study materials as a backup file (JSON format)
            </p>
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
            >
              {exportLoading ? '⏳ Exporting...' : '📥 Export All Data'}
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Storage Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              All your data is stored locally in your browser. No cloud backup.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded p-3 text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Tip:</strong> Export your data regularly to prevent loss
              if you clear browser data or switch devices.
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">⚠️ Danger Zone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Clear all your data from this app. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-800 dark:text-white">Edumate</strong> - Your AI Learning Companion
          </p>
          <p>Version 1.0.0</p>
          <p>
            Built with Chrome Built-in AI APIs for privacy-first, offline learning
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © 2025 Edumate. Built for Google Chrome Built-in AI Challenge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
