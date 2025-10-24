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

const createSession = async (options = {}) => {
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available on this device');
    }
    const params = await LanguageModel.params();
    const session = await LanguageModel.create({
      temperature: options.temperature || params.defaultTemperature,
      topK: options.topK || params.defaultTopK,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const percent = Math.round(e.loaded * 100);
          console.log(`Downloaded ${percent}%`);
        });
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const summarizeText = async (text) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    console.log('Creating session for summarization...');
    session = await createSession({});
    console.log('Summarizing text...');
    const result = await session.prompt(`Summarize the following text concisely:\n\n${text}`);
    return result;
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  } finally {
    if (session) {
      session.destroy();
      console.log('Session destroyed');
    }
  }
};

export const generateQuestions = async (text) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    console.log('Creating session for question generation...');
    session = await createSession({});
    console.log('Generating questions...');
    const prompt = `Generate 5 practice questions with answers based on:\n\n${text}`;
    const result = await session.prompt(prompt);
    return result;
  } catch (error) {
    console.error('Question generation error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};

export const rewriteText = async (text, tone = 'formal') => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    console.log('Creating session for rewriting...');
    session = await createSession({});
    console.log('Rewriting text...');
    const result = await session.prompt(`Rewrite this text with a ${tone} tone:\n\n${text}`);
    return result;
  } catch (error) {
    console.error('Rewriting error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};

export const proofreadText = async (text) => {
  let session = null;
  try {
    const available = await LanguageModel.availability();
    if (available === 'unavailable') {
      throw new Error('LanguageModel is not available');
    }
    console.log('Creating session for proofreading...');
    session = await createSession({});
    console.log('Proofreading text...');
    const result = await session.prompt(
      `Proofread this text and suggest corrections for grammar and spelling:\n\n${text}`
    );
    return result;
  } catch (error) {
    console.error('Proofreading error:', error);
    throw error;
  } finally {
    if (session) session.destroy();
  }
};