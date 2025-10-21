// Utility functions to process different file types
// Currently supports: Text files, PDF files

// Extract text from PDF files
export async function extractPDFText(file) {
  try {
    // Check if pdf.js is available (needs to be installed)
    if (!window.pdfjsLib) {
      // If pdf.js is not loaded, try to use a simple fallback
      throw new Error('PDF.js library not loaded. Please install: npm install pdfjs-dist')
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()

  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF. Please try a different file.')
  }
}

// Extract text from image files (using Prompt API with vision)
// Note: This requires Chrome's Prompt API with multimodal support
export async function extractImageText(file) {
  try {
    if (!('ai' in window && 'languageModel' in window.ai)) {
      throw new Error('Image processing requires Chrome Built-in AI APIs')
    }

    // Convert image to base64
    const base64 = await fileToBase64(file)

    const session = await window.ai.languageModel.create({
      systemPrompt: 'You are an OCR assistant. Extract all text from images accurately.'
    })

    // Note: This is a placeholder - actual implementation depends on
    // Chrome's Prompt API supporting image inputs
    const prompt = 'Extract all text from this image. Return only the text content.'
    const result = await session.prompt(prompt)

    return result

  } catch (error) {
    console.error('Image text extraction error:', error)
    throw new Error('Failed to extract text from image')
  }
}

// Helper: Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Transcribe audio files (future feature)
// Note: This would use Chrome's Speech Recognition or Whisper API when available
export async function transcribeAudio(file) {
  throw new Error('Audio transcription coming soon!')
}

// Process web URLs to extract main content
export async function extractWebContent(url) {
  try {
    // This would need a backend proxy to avoid CORS issues
    const response = await fetch(url)
    const html = await response.text()
    
    // Simple HTML text extraction (basic implementation)
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Try to get main content
    const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body
    const text = mainContent.textContent.trim()
    
    return text

  } catch (error) {
    console.error('Web content extraction error:', error)
    throw new Error('Failed to extract web content')
  }
}