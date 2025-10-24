export const checkAIAvailability = async () => {
  console.log('🔍 Checking Chrome Built-in AI System');
  
  const availability = {};
  
  try {
    if ('LanguageModel' in self) {
      availability.languageModel = await self.LanguageModel.availability();
      console.log('✅ LanguageModel available:', availability.languageModel);
    } else {
      availability.languageModel = 'unavailable';
    }
    
    console.log('✅ Final AI Availability:', availability);
    return availability;
    
  } catch (error) {
    console.error('❌ Error checking AI availability:', error);
    return { error: error.message };
  }
};
export const summarizeText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing model...' });
    }
    
    const session = await self.LanguageModel.create({
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
    
    const prompt = `Summarize the following text concisely:\n\n${text}`;
    
    const summary = await session.prompt(prompt);
    session.destroy();
    
    return summary;
    
  } catch (error) {
    console.error('Summarizer error:', error);
    throw new Error(`Summarization failed: ${error.message}`);
  }
};
export const generateQuestions = async (text, options = {}, onProgress = null) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing model...' });
    }
    
    const session = await self.LanguageModel.create({
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
    
    const prompt = `Generate 5 practice questions with answers based on this content:\n\n${text}\n\nFormat each as "Q: ... A: ..."`;
    
    const questions = await session.prompt(prompt);
    session.destroy();
    
    return questions;
    
  } catch (error) {
    console.error('Question generation error:', error);
    throw new Error(`Question generation failed: ${error.message}`);
  }
};
export const rewriteText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing model...' });
    }
    
    const session = await self.LanguageModel.create({
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
    
    const tone = options.tone || 'formal';
    const prompt = `Rewrite the following text with a ${tone} tone:\n\n${text}`;
    
    const rewritten = await session.prompt(prompt);
    session.destroy();
    
    return rewritten;
    
  } catch (error) {
    console.error('Rewriter error:', error);
    throw new Error(`Rewriting failed: ${error.message}`);
  }
};
export const proofreadText = async (text, options = {}, onProgress = null) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing model...' });
    }
    
    const session = await self.LanguageModel.create({
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
    
    const prompt = `Proofread and suggest corrections for grammar, spelling issues in this text:\n\n${text}`;
    
    const result = await session.prompt(prompt);
    session.destroy();
    
    return result;
    
  } catch (error) {
    console.error('Proofreader error:', error);
    throw new Error(`Proofreading failed: ${error.message}`);
  }
};
export const translateText = async (text, targetLanguage, options = {}, onProgress = null) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    if (onProgress) {
      onProgress({ status: 'info', message: 'Initializing translator...' });
    }
    
    const session = await self.LanguageModel.create({
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
    
    const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
    
    const translated = await session.prompt(prompt);
    session.destroy();
    
    return translated;
    
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
};
export const detectLanguage = async (text) => {
  try {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in this browser');
    }
    
    const availability = await self.LanguageModel.availability();
    if (availability === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    
    const session = await self.LanguageModel.create();
    
    const prompt = `Detect the language of this text and respond ONLY with the language code (e.g., 'en', 'es', 'fr'):\n\n${text}`;
    
    const result = await session.prompt(prompt);
    session.destroy();
    
    return { detectedLanguage: result.trim(), confidence: 1.0 };
    
  } catch (error) {
    console.error('Language detection error:', error);
    throw new Error(`Language detection failed: ${error.message}`);
  }
};