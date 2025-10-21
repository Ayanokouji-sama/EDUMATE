// frontend/src/services/ai/index.js

// Get API key from environment variable (Vite format)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Check AI APIs availability
export const checkAIAvailability = async () => {
  const availability = {
    summarizer: false,
    translator: false,
    writer: false,
    rewriter: false,
    languageModel: false,
    gemini: false
  }

  if (typeof window !== 'undefined' && window.ai) {
    try {
      availability.summarizer = 'summarizer' in window.ai
      availability.translator = 'translator' in window.ai
      availability.writer = 'writer' in window.ai
      availability.rewriter = 'rewriter' in window.ai
      availability.languageModel = 'languageModel' in window.ai
    } catch (error) {
      console.warn('Error checking built-in AI APIs:', error)
    }
  }

  // Check if Gemini API key is available
  availability.gemini = !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here'

  console.log('AI APIs availability:', availability)
  return availability
}

// Gemini API helper function
const callGeminiAPI = async (prompt, options = {}) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 2048,
        }
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || ''
}

// Summarize text
export const summarizeText = async (text, options = {}, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    // Try built-in AI first
    if (availability.summarizer) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Chrome Built-in AI...' })
      try {
        const summarizer = await window.ai.summarizer.create({
          type: options.type || 'tl;dr',
          length: options.length || 'medium'
        })
        const result = await summarizer.summarize(text)
        summarizer.destroy()
        return result
      } catch (error) {
        console.warn('Built-in AI failed, falling back to Gemini:', error)
      }
    }

    // Fallback to Gemini
    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Gemini AI...' })
      const lengthGuide = {
        short: '2-3 sentences',
        medium: '1 paragraph (4-6 sentences)',
        long: '2-3 paragraphs'
      }
      const prompt = `Summarize the following text in ${lengthGuide[options.length || 'medium']}:\n\n${text}`
      return await callGeminiAPI(prompt)
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Summarization error:', error)
    throw error
  }
}

// Rewrite text
export const rewriteText = async (text, options = {}, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()
    const tone = options.tone || 'formal'

    if (availability.rewriter) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Chrome Built-in AI...' })
      try {
        const rewriter = await window.ai.rewriter.create({ tone })
        const result = await rewriter.rewrite(text)
        rewriter.destroy()
        return result
      } catch (error) {
        console.warn('Built-in AI failed, falling back to Gemini:', error)
      }
    }

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Gemini AI...' })
      const toneMap = {
        'more-casual': 'casual and friendly',
        'more-formal': 'formal and professional',
        'formal': 'formal and professional',
        'casual': 'casual and conversational'
      }
      const toneDescription = toneMap[tone] || tone
      const prompt = `Rewrite the following text in a ${toneDescription} tone. Keep the same length:\n\n${text}`
      return await callGeminiAPI(prompt)
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Rewrite error:', error)
    throw error
  }
}

// Generate questions
export const generateQuestions = async (text, count = 5, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Generating questions...' })
      const prompt = `Based on the following text, generate ${count} thoughtful questions that test understanding. Format as a numbered list:\n\n${text}`
      const result = await callGeminiAPI(prompt)
      return result
        .split('\n')
        .filter(line => line.trim().match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Question generation error:', error)
    throw error
  }
}

// Generate flashcards
export const generateFlashcards = async (text, count = 10, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Generating flashcards...' })
      const prompt = `Create ${count} flashcards from this text. Format each as "Q: [question]\\nA: [answer]\\n---\\n":\n\n${text}`
      const result = await callGeminiAPI(prompt, { maxTokens: 3000 })
      const flashcards = result
        .split('---')
        .filter(card => card.trim())
        .map(card => {
          const [q, a] = card.split('\nA:')
          return {
            question: q.replace('Q:', '').trim(),
            answer: a ? a.trim() : ''
          }
        })
        .filter(card => card.question && card.answer)
        .slice(0, count)
      return flashcards
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Flashcard generation error:', error)
    throw error
  }
}

// Generate quiz
export const generateQuiz = async (text, count = 5, difficulty = 'medium', onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Generating quiz...' })
      const prompt = `Create a ${difficulty} difficulty quiz with ${count} multiple choice questions from this text.

Format each question as:
Q: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Correct: [letter]

---

Text: ${text}`
      const result = await callGeminiAPI(prompt, { maxTokens: 3000 })
      const questions = result
        .split('---')
        .filter(q => q.trim())
        .map(q => {
          const lines = q.trim().split('\n')
          const question = lines[0].replace('Q:', '').trim()
          const options = lines.slice(1, 5).map(opt => opt.substring(3).trim())
          const correctLine = lines.find(l => l.startsWith('Correct:'))
          const correct = correctLine ? correctLine.split(':')[1].trim().toUpperCase() : 'A'
          return { question, options, correct }
        })
        .filter(q => q.question && q.options.length === 4)
        .slice(0, count)
      return questions
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Quiz generation error:', error)
    throw error
  }
}

// Proofread text
export const proofreadText = async (text, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Proofreading...' })
      const prompt = `Proofread and correct any grammar, spelling, or punctuation errors in this text. Return only the corrected version:\n\n${text}`
      return await callGeminiAPI(prompt)
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Proofreading error:', error)
    throw error
  }
}

// Translate text
export const translateText = async (text, targetLanguage, onProgress = null) => {
  try {
    const availability = await checkAIAvailability()

    if (availability.translator) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Chrome Built-in AI...' })
      try {
        const translator = await window.ai.translator.create({
          sourceLanguage: 'en',
          targetLanguage
        })
        const result = await translator.translate(text)
        translator.destroy()
        return result
      } catch (error) {
        console.warn('Built-in AI failed, falling back to Gemini:', error)
      }
    }

    if (availability.gemini) {
      if (onProgress) onProgress({ status: 'info', message: 'Using Gemini AI...' })
      const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`
      return await callGeminiAPI(prompt)
    }

    throw new Error('No AI service available. Please configure Gemini API key in .env file')
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

// Default export
export default {
  summarizeText,
  rewriteText,
  generateQuestions,
  generateFlashcards,
  generateQuiz,
  proofreadText,
  translateText,
  checkAIAvailability
}
