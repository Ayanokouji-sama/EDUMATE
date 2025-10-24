export const getModelParams = async () => {
  try {
    const params = await LanguageModel.params();
    console.log('Model params:', params);
    return params;
  } catch (error) {
    console.error('Error getting model params:', error);
    throw error;
  }
};

export const checkAIAvailability = async () => {
  console.log('🔍 Checking Chrome Built-in AI System');
  try {
    const available = await LanguageModel.availability();
    console.log('✅ AI Availability:', available);
    return available;
  } catch (error) {
    console.error('❌ Error checking AI availability:', error);
    return 'unavailable';
  }
};

export const createSession = async (options = {}, onProgress = null) => {
  try {
    const available = await LanguageModel.availability(); 
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available on this device');
    }
    const params = await LanguageModel.params();
    const config = {
      temperature: options.temperature || params.defaultTemperature,
      topK: options.topK || params.defaultTopK,
    };
    if (config.temperature && config.topK) {
      config.temperature = Math.min(config.temperature, params.maxTemperature);
      config.topK = Math.min(config.topK, params.maxTopK);
    }
    const session = await LanguageModel.create({
      ...config,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const percent = Math.round(e.loaded * 100);
          console.log(`Downloaded ${percent}%`);
          if (onProgress) {
            onProgress({ status: 'downloading', percent });
          }
        });
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const summarizeText = async (text, onProgress = null) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    if (onProgress) onProgress({ status: 'info', message: 'Creating session...' });
    session = await createSession({}, onProgress);
    if (onProgress) onProgress({ status: 'info', message: 'Summarizing...' });
    const result = await session.prompt(`Summarize the following text:\n\n${text}`);
    return result;
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};

export const generateQuestions = async (text, onProgress = null) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    if (onProgress) onProgress({ status: 'info', message: 'Creating session...' });
    session = await createSession({}, onProgress);
    if (onProgress) onProgress({ status: 'info', message: 'Generating questions...' });
    const prompt = `Generate 5 practice questions with answers based on:\n\n${text}\n\nFormat: Q1: ... A1: ...`;
    const result = await session.prompt(prompt);
    return result;
  } catch (error) {
    console.error('Question generation error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};

export const rewriteText = async (text, tone = 'formal', onProgress = null) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    if (onProgress) onProgress({ status: 'info', message: 'Creating session...' });
    session = await createSession({}, onProgress);
    if (onProgress) onProgress({ status: 'info', message: 'Rewriting...' });
    const result = await session.prompt(`Rewrite this text with a ${tone} tone:\n\n${text}`);
    return result;
  } catch (error) {
    console.error('Rewriting error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};

export const proofreadText = async (text, onProgress = null) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    if (onProgress) onProgress({ status: 'info', message: 'Creating session...' });
    session = await createSession({}, onProgress);
    if (onProgress) onProgress({ status: 'info', message: 'Proofreading...' });
    const result = await session.prompt(`Proofread and correct grammar/spelling in:\n\n${text}`);
    return result;
  } catch (error) {
    console.error('Proofreading error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};
export const createAbortableSession = async (options = {}) => {
  const controller = new AbortController();
  try {
    const session = await LanguageModel.create({
      signal: controller.signal,
      ...options,
    });
    return { session, controller };
  } catch (error) {
    console.error('Error creating abortable session:', error);
    throw error;
  }
};

export const createContextualSession = async (systemPrompt = null, onProgress = null) => {
  try {
    const initialPrompts = [];
    if (systemPrompt) {
      initialPrompts.push({
        role: 'system',
        content: systemPrompt,
      });
    }
    const session = await LanguageModel.create({
      initialPrompts,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          if (onProgress) {
            onProgress({ status: 'downloading', percent: Math.round(e.loaded * 100) });
          }
        });
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating contextual session:', error);
    throw error;
  }
};

export const promptStreaming = async (text, onChunk = null, onProgress = null) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    session = await createSession({}, onProgress);
    const stream = session.promptStreaming(text);
    let fullResult = '';
    for await (const chunk of stream) {
      fullResult += chunk;
      if (onChunk) onChunk(chunk);
    }
    return fullResult;
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};
