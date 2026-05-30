const express = require('express');
const Groq = require('groq-sdk');

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  zh: 'Chinese',
};

const LANGUAGE_FLAGS = {
  en: '🇬🇧', hi: '🇮🇳', bn: '🇧🇩', es: '🇪🇸', fr: '🇫🇷',
  de: '🇩🇪', ja: '🇯🇵', ko: '🇰🇷', pt: '🇵🇹', ru: '🇷🇺',
  ar: '🇸🇦', zh: '🇨🇳',
};

const getSystemPrompt = (lang) => {
  const langName = SUPPORTED_LANGUAGES[lang] || 'English';
  return `You are a helpful, knowledgeable blog assistant for DevBlog Hub.
You MUST respond in ${langName} language.
You can:
- Summarize blog posts or topics
- Suggest blog post ideas and topics
- Explain technical concepts clearly
- Help users understand web development, AI, DevOps, and design
- Provide coding tips and best practices
Keep responses concise, informative, and friendly.
IMPORTANT: Always respond in ${langName}. Never use any other language.`;
};

router.post('/', async (req, res) => {
  try {
    const { message, context, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please provide a message.' });
    }

    const lang = SUPPORTED_LANGUAGES[language] ? language : 'en';

    const messages = [
      { role: 'system', content: getSystemPrompt(lang) },
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Current blog context: ${context}`,
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply, language: lang });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    if (error.status === 401 || error.status === 403) {
      return res.status(500).json({ reply: 'AI service authentication failed. Check GROQ_API_KEY.' });
    }
    if (error.status === 429) {
      return res.status(500).json({ reply: 'AI service is rate limited. Please wait a moment and try again.' });
    }
    res.status(500).json({ reply: 'AI service is temporarily unavailable. Please try again later.' });
  }
});

module.exports = router;
module.exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
module.exports.LANGUAGE_FLAGS = LANGUAGE_FLAGS;
