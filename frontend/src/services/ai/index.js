// Chrome Built-in AI APIs - Official Implementation for Google Chrome AI Challenge 2025
// Based on Chrome Developer Documentation and Google I/O 2025

// ============================================
// 1. CHECK AI AVAILABILITY
// ============================================
export const checkAIAvailability = async () => {
  console.log('🔍 Checking Chrome Built-in AI System');
  
  const availability = {};
  
  // Check Language Model (Prompt API)
  if ('ai' in self && 'languageModel' in self.ai) {
    availability.languageModel = await self.ai.languageModel.availability();
  } else {
    availability.languageModel = 'unavailable';
  }
  
  // Check Summarizer API
  if ('ai' in self && 'summarizer' in self.ai) {
    availability.summarizer = await self.ai.summarizer.availability();
  } else {
    availability.summarizer = 'unavailable';
  }
  
  // Check Writer API
  if ('ai' in self && 'writer' in self.ai) {
    availability.writer = await self.ai.writer.availability();
  } else {
    availability.writer = 'unavailable';
  }
  
  // Check Rewriter API
  if ('ai' in self && 'rewriter' in self.ai) {
    availability.rewriter = await self.ai.rewriter.availability();
  } else {
    availability.rewriter = 'unavailable';
  }
  
  // Check Translator API
  if ('ai' in self && 'translator' in self.ai) {
    availability.translator = await self.ai.translator.availability();
  } else {
    availability.translator = 'unavailable';
  }
  
  // Check Language Detector API
  if ('ai' in self && 'languageDetector' in self.ai) {
    availability.languageDetector = await self.ai.languageDetector.availability();
  } else {
    availability.languageDetector = 'unavailable';
  }
  
  console.log('✅ AI Availability:', availability);
  return availability;
};

// ============================================
// 2. SUMMARIZER API
// ============================================
export const summarizeText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('ai' in self) || !('summarizer' in self.ai)) {
      throw new Error('Summarizer API not available in this browser');
    }

    const availability = await self.ai.summarizer.availability();
    if (availability === 'unavailable') {
      throw new Error('Summarizer is not available on this device');
    }

    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing summarizer...' });
    }

    // Create summarizer with options
    const summarizer = await self.ai.summarizer.create({
      type: options.type || 'key-points', // 'key-points', 'tl;dr', 'teaser', 'headline'
      format: 'markdown',
      length: options.length || 'medium', // 'short', 'medium', 'long'
      sharedContext: options.context || '',
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({
              status: 'info',
              message: `Downloading model... ${Math.round(e.loaded * 100)}%`
            });
          }
        });
      }
    });

    if (onProgress) {
      onProgress({ status: 'info', message: 'Generating summary...' });
    }

    // Generate summary
    const summary = await summarizer.summarize(text, {
      context: options.context || ''
    });

    // Cleanup
    summarizer.destroy();

    return summary;
  } catch (error) {
    console.error('Summarizer error:', error);
    throw new Error(`Summarization failed: ${error.message}`);
  }
};

// ============================================
// 3. WRITER API (for generating questions)
// ============================================
export const generateQuestions = async (text, options = {}, onProgress = null) => {
  try {
    if (!('ai' in self) || !('writer' in self.ai)) {
      throw new Error('Writer API not available in this browser');
    }

    const availability = await self.ai.writer.availability();
    if (availability === 'unavailable') {
      throw new Error('Writer is not available on this device');
    }

    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing writer...' });
    }

    const writer = await self.ai.writer.create({
      sharedContext: `Generate 5 practice questions with answers based on this content: ${text}`,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({
              status: 'info',
              message: `Downloading model... ${Math.round(e.loaded * 100)}%`
            });
          }
        });
      }
    });

    if (onProgress) {
      onProgress({ status: 'info', message: 'Generating questions...' });
    }

    const questions = await writer.write('Create 5 practice questions with answers based on the provided content.');

    writer.destroy();

    return questions;
  } catch (error) {
    console.error('Writer error:', error);
    throw new Error(`Question generation failed: ${error.message}`);
  }
};

// ============================================
// 4. REWRITER API
// ============================================
export const rewriteText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('ai' in self) || !('rewriter' in self.ai)) {
      throw new Error('Rewriter API not available in this browser');
    }

    const availability = await self.ai.rewriter.availability();
    if (availability === 'unavailable') {
      throw new Error('Rewriter is not available on this device');
    }

    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing rewriter...' });
    }

    const rewriter = await self.ai.rewriter.create({
      tone: options.tone || 'more-formal', // 'more-formal', 'more-casual', 'as-is'
      length: options.length || 'as-is', // 'shorter', 'longer', 'as-is'
      sharedContext: options.context || '',
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({
              status: 'info',
              message: `Downloading model... ${Math.round(e.loaded * 100)}%`
            });
          }
        });
      }
    });

    if (onProgress) {
      onProgress({ status: 'info', message: 'Rewriting text...' });
    }

    const rewritten = await rewriter.rewrite(text, {
      context: options.context || ''
    });

    rewriter.destroy();

    return rewritten;
  } catch (error) {
    console.error('Rewriter error:', error);
    throw new Error(`Rewriting failed: ${error.message}`);
  }
};

// ============================================
// 5. PROOFREADER API
// ============================================
export const proofreadText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('ai' in self) || !('proofreader' in self.ai)) {
      throw new Error('Proofreader API not available in this browser');
    }

    const availability = await self.ai.proofreader.availability();
    if (availability === 'unavailable') {
      throw new Error('Proofreader is not available on this device');
    }

    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing proofreader...' });
    }

    const proofreader = await self.ai.proofreader.create({
      sharedContext: options.context || '',
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({
              status: 'info',
              message: `Downloading model... ${Math.round(e.loaded * 100)}%`
            });
          }
        });
      }
    });

    if (onProgress) {
      onProgress({ status: 'info', message: 'Proofreading text...' });
    }

    const result = await proofreader.proofread(text);

    proofreader.destroy();

    return result;
  } catch (error) {
    console.error('Proofreader error:', error);
    throw new Error(`Proofreading failed: ${error.message}`);
  }
};

// ============================================
// 6. TRANSLATOR API
// ============================================
export const translateText = async (text, targetLanguage, options = {}, onProgress = null) => {
  try {
    if (!('ai' in self) || !('translator' in self.ai)) {
      throw new Error('Translator API not available in this browser');
    }

    const availability = await self.ai.translator.availability({
      sourceLanguage: options.sourceLanguage || 'en',
      targetLanguage: targetLanguage
    });

    if (availability === 'unavailable') {
      throw new Error(`Translation to ${targetLanguage} is unavailable`);
    }

    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing translator...' });
    }

    const translator = await self.ai.translator.create({
      sourceLanguage: options.sourceLanguage || 'en',
      targetLanguage: targetLanguage,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({
              status: 'info',
              message: `Downloading model... ${Math.round(e.loaded * 100)}%`
            });
          }
        });
      }
    });

    if (onProgress) {
      onProgress({ status: 'info', message: 'Translating text...' });
    }

    const translated = await translator.translate(text);

    translator.destroy();

    return translated;
  } catch (error) {
    console.error('Translator error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
};

// ============================================
// 7. LANGUAGE DETECTOR API
// ============================================
export const detectLanguage = async (text) => {
  try {
    if (!('ai' in self) || !('languageDetector' in self.ai)) {
      throw new Error('Language Detector API not available in this browser');
    }

    const availability = await self.ai.languageDetector.availability();
    if (availability === 'unavailable') {
      throw new Error('Language Detector is not available on this device');
    }

    const languageDetector = await self.ai.languageDetector.create();
    const results = await languageDetector.detect(text);
    
    languageDetector.destroy();

    // Return most likely language with confidence
    return results[0] || { detectedLanguage: 'unknown', confidence: 0 };
  } catch (error) {
    console.error('Language detection error:', error);
    throw new Error(`Language detection failed: ${error.message}`);
  }
};
