import { useState } from 'react'
import { saveContent } from '../services/api/indexedDB'
import { summarizeText, checkAIAvailability, generateQuestions, rewriteText, proofreadText } from '../services/ai'
import { extractPDFText } from '../utils/fileProcessors'

function Upload() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [aiAvailable, setAiAvailable] = useState({})
  const [selectedTool, setSelectedTool] = useState('summarize')
  const [progress, setProgress] = useState({ status: 'idle', message: '' })

  const checkAvailability = () => {
    const available = checkAIAvailability()
    setAiAvailable(available)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setSuccess('')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError('')
      setSuccess('')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file && !text) {
      setError('Please select a file or enter text')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    setProgress({ status: 'starting', message: 'Starting...' })

    try {
      let contentToProcess = text
      if (file) {
        setProgress({ status: 'reading', message: 'Reading file...' })

        if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
          contentToProcess = await file.text()
        } 
        else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          try {
            contentToProcess = await extractPDFText(file)
          } catch (err) {
            setError('Failed to read PDF. Please try a different file.')
            setLoading(false)
            return
          }
        }
        else if (file.type.startsWith('image/')) {
          setError('Image processing coming soon! For now, please use text or PDF files.')
          setLoading(false)
          return
        } 
        else if (file.type.startsWith('audio/')) {
          setError('Audio processing coming soon! For now, please use text or PDF files.')
          setLoading(false)
          return
        } 
        else {
          setError('File type not supported. Please use .txt or .pdf files.')
          setLoading(false)
          return
        }
      }

      if (!contentToProcess || contentToProcess.trim().length < 10) {
        setError('Please provide more text to process (at least 10 characters)')
        setLoading(false)
        return
      }

      let processedResult = null
      const onProgress = (progressInfo) => {
        setProgress(progressInfo)
      }
      if (selectedTool === 'summarize') {
        processedResult = await summarizeText(
          contentToProcess, 
          { type: 'tl;dr', format: 'plain-text', length: 'medium' },
          onProgress
        )
      } 
      else if (selectedTool === 'simplify') {
        processedResult = await rewriteText(
          contentToProcess, 
          { tone: 'more-casual', length: 'as-is' },
          onProgress
        )
      } 
      else if (selectedTool === 'proofread') {
        processedResult = await proofreadText(contentToProcess, onProgress)
      } 
      else if (selectedTool === 'questions') {
        processedResult = await generateQuestions(contentToProcess, 5, onProgress)
      }

      await saveContent({
        title: file ? file.name : 'Direct text input',
        type: selectedTool,  
        result: processedResult,  
        originalText: contentToProcess,  
        fileType: file ? file.type : 'text/plain',
        timestamp: Date.now()
      })

      setResult({
        original: contentToProcess,
        processed: processedResult,
        tool: selectedTool
      })

      setSuccess('Content processed and saved successfully!')
      setFile(null)
      setText('')

    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setProgress({ status: 'idle', message: '' })
    }
  }

  const copyToClipboard = () => {
    if (result?.processed) {
      navigator.clipboard.writeText(result.processed)
      alert('Copied to clipboard!')
    }
  }

  const downloadResult = () => {
    if (result?.processed) {
      const blob = new Blob([result.processed], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.tool}_result.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Content</h1>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <button
            onClick={checkAvailability}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Check AI Availability
          </button>
          {Object.keys(aiAvailable).length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(aiAvailable).map(([key, value]) => (
                <div 
                  key={key} 
                  className={`p-3 rounded ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  <span className="font-medium capitalize">{key}:</span> {value ? '✓ Available' : '✗ Not Available'}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upload or Paste Content</h2>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              {loading && progress.status !== 'idle' && (
                <div className="bg-blue-50 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
                    <span>{progress.message}</span>
                  </div>
                </div>
              )}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center mb-6 hover:bg-blue-50 transition cursor-pointer"
              >
                <p className="text-gray-600 mb-2">Drag & drop your file here</p>
                <p className="text-gray-500 text-sm mb-4">Supports: .txt, .pdf</p>
                <label className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 transition inline-block">
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.pdf,text/plain,application/pdf"
                    disabled={loading}
                  />
                </label>

                {file && (
                  <div className="mt-4 bg-blue-50 p-4 rounded">
                    <p className="text-gray-800 font-medium">Selected: {file.name}</p>
                    <p className="text-gray-600 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Or paste text directly:
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({text.length} characters)
                  </span>
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="6"
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3">Select AI Tool:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'summarize', label: 'Summarize', icon: '📝' },
                    { id: 'simplify', label: 'Simplify', icon: '✨' },
                    { id: 'proofread', label: 'Proofread', icon: '✅' },
                    { id: 'questions', label: 'Generate Q&A', icon: '❓' }
                  ].map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`px-4 py-3 rounded font-medium transition ${
                        selectedTool === tool.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      disabled={loading}
                    >
                      <span className="mr-2">{tool.icon}</span>
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Processing...' : 'Process Content'}
              </button>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>

              {!result ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No results yet</p>
                  <p className="text-gray-400 text-sm">Upload content to see results</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Tool used: <span className="font-bold capitalize">{result.tool}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto mb-4">
                    <h3 className="font-bold text-gray-800 mb-2">Result:</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {result.processed}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={downloadResult}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload