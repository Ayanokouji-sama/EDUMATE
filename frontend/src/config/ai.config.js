// Gemini AI Service - Cloud-based summarization
import { AI_CONFIG, getGeminiUrl } from '../config/ai.config';

class GeminiService {
  constructor(apiKey = AI_CONFIG.gemini.apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = AI_CONFIG.gemini.apiUrl;
  }

  async summarize(text, options = {}) {
    const {
      type = 'key-points',
      length = 'medium',
      format = 'markdown'
    } = options;

    try {
      // Build the prompt based on options
      const prompt = this.buildPrompt(text, type, length, format);

      // Call Gemini API
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
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
            temperature: 0.4,
            maxOutputTokens: this.getMaxTokens(length),
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API request failed');
      }

      const data = await response.json();
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!summary) {
        throw new Error('No summary generated');
      }

      return summary.trim();
    } catch (error) {
      console.error('Gemini summarization error:', error);
      throw new Error(`Failed to summarize: ${error.message}`);
    }
  }

  buildPrompt(text, type, length, format) {
    const lengthGuide = {
      short: '2-3 sentences',
      medium: '1 paragraph (4-6 sentences)',
      long: '2-3 paragraphs'
    };

    let prompt = '';

    switch (type) {
      case 'key-points':
        prompt = `Extract the key points from the following text as a bullet list. Keep it concise (${lengthGuide[length]}):\n\n${text}`;
        break;
      case 'tl;dr':
        prompt = `Provide a TL;DR (Too Long; Didn't Read) summary in ${lengthGuide[length]}:\n\n${text}`;
        break;
      case 'teaser':
        prompt = `Write an engaging teaser/preview in ${lengthGuide[length]} that makes someone want to read more:\n\n${text}`;
        break;
      case 'headline':
        prompt = `Create a compelling headline (1 sentence) that captures the main idea:\n\n${text}`;
        break;
      default:
        prompt = `Summarize the following text in ${lengthGuide[length]}:\n\n${text}`;
    }

    if (format === 'markdown') {
      prompt += '\n\nFormat the response in clean markdown.';
    }

    return prompt;
  }

  getMaxTokens(length) {
    const tokenLimits = {
      short: 150,
      medium: 300,
      long: 600
    };
    return tokenLimits[length] || 300;
  }

  // Check if API key is configured
  isConfigured() {
    return this.apiKey && this.apiKey !== 'AIzaSyB4ZN7auAPt1jMeLZDCrAs9DVoE7rPKpiQ';
  }
}

export default GeminiService;