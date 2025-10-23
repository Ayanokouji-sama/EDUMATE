export const checkAIAvailability = async () => {
  console.log('🔍 Checking Chrome Built-in AI System');
  
  const availability = {};
  if ('ai' in self && 'languageModel' in self.ai) {
    availability.languageModel = await self.ai.languageModel.availability();
  } else {
    availability.languageModel = 'unavailable';
  }
  if ('ai' in self && 'summarizer' in self.ai) {
    availability.summarizer = await self.ai.summarizer.availability();
  } else {
    availability.summarizer = 'unavailable';
  }
  if ('ai' in self && 'writer' in self.ai) {
    availability.writer = await self.ai.writer.availability();
  } else {
    availability.writer = 'unavailable';
  }
  if ('ai' in self && 'rewriter' in self.ai) {
    availability.rewriter = await self.ai.rewriter.availability();
  } else {
    availability.rewriter = 'unavailable';
  }
  if ('ai' in self && 'translator' in self.ai) {
    availability.translator = await self.ai.translator.availability();
  } else {
    availability.translator = 'unavailable';
  }
  if ('ai' in self && 'languageDetector' in self.ai) {
    availability.languageDetector = await self.ai.languageDetector.availability();
  } else {
    availability.languageDetector = 'unavailable';
  }
  
  console.log('✅ AI Availability:', availability);
  return availability;
};
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
    const summarizer = await self.ai.summarizer.create({
      type: options.type || 'key-points', 
      format: 'markdown',
      length: options.length || 'medium', 
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
    const summary = await summarizer.summarize(text, {
      context: options.context || ''
    });
    summarizer.destroy();

    return summary;
  } catch (error) {
    console.error('Summarizer error:', error);
    throw new Error(`Summarization failed: ${error.message}`);
  }
};
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
      tone: options.tone || 'more-formal', 
      length: options.length || 'as-is', 
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
    return results[0] || { detectedLanguage: 'unknown', confidence: 0 };
  } catch (error) {
    console.error('Language detection error:', error);
    throw new Error(`Language detection failed: ${error.message}`);
  }
};
