import { useState, useEffect } from 'react';
import { getAllContent, deleteContent } from '../services/api/indexedDB';
function Library() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const allContent = await getAllContent();
      const sorted = allContent.sort((a, b) => b.timestamp - a.timestamp);
      setContent(sorted);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteContent(id);
        setContent(content.filter(item => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleDownload = (item) => {
    const blob = new Blob([item.result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title || 'content'}_${item.type}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredContent = filter === 'all' ? content : content.filter(item => item.type === filter);

  const getTypeIcon = (type) => {
    const icons = { summarize: '📝', simplify: '✨', proofread: '✅', questions: '❓' };
    return icons[type] || '📄';
  };

  const getTypeColor = (type) => {
    const colors = {
      summarize: 'bg-blue-100 text-blue-700',
      simplify: 'bg-purple-100 text-purple-700',
      proofread: 'bg-green-100 text-green-700',
      questions: 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading...</div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{content.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{content.filter(i => i.type === 'summarize').length}</div>
          <div className="text-sm text-gray-600">Summaries</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{content.filter(i => i.type === 'questions').length}</div>
          <div className="text-sm text-gray-600">Question Sets</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{content.filter(i => i.type === 'proofread').length}</div>
          <div className="text-sm text-gray-600">Proofread Items</div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `All (${content.length})`, color: 'indigo' },
          { key: 'summarize', label: `📝 Summaries (${content.filter(i => i.type === 'summarize').length})`, color: 'blue' },
          { key: 'simplify', label: `✨ Simplified (${content.filter(i => i.type === 'simplify').length})`, color: 'purple' },
          { key: 'proofread', label: `✅ Proofread (${content.filter(i => i.type === 'proofread').length})`, color: 'green' },
          { key: 'questions', label: `❓ Questions (${content.filter(i => i.type === 'questions').length})`, color: 'orange' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-lg ${filter === btn.key ? `bg-${btn.color}-600 text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {filteredContent.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Your library is empty</h3>
          <p className="text-gray-600">Start uploading content to build your library</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer" onClick={() => setSelectedItem(item)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title || 'Untitled'}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(item.type)}`}>{item.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.result?.substring(0, 150)}...</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleCopy(item.result); }} className="text-blue-600 hover:text-blue-800">Copy</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDownload(item); }} className="text-green-600 hover:text-green-800">Download</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title || 'Untitled'}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(selectedItem.type)}`}>{selectedItem.type}</span>
                    <span className="text-sm text-gray-500">{new Date(selectedItem.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">{selectedItem.result}</pre>
            </div>
            <div className="p-6 border-t flex gap-2">
              <button onClick={() => handleCopy(selectedItem.result)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Copy</button>
              <button onClick={() => handleDownload(selectedItem)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Download</button>
              <button onClick={() => { handleDelete(selectedItem.id); setSelectedItem(null); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Library;
