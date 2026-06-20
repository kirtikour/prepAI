const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Clean potential markdown codeblock formatting if returned by the model.
 * @param {string} rawText 
 * @returns {string}
 */
const cleanJsonText = (rawText) => {
  return rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
};

/**
 * Call Gemini API and return the parsed JSON response, with a retry-once logic.
 * @param {string} prompt 
 * @returns {Promise<any>}
 */
const generateJson = async (prompt) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const attemptCall = async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = cleanJsonText(text);
    return JSON.parse(cleaned);
  };

  try {
    return await attemptCall();
  } catch (err) {
    console.error('Gemini API call or JSON parse failed, retrying once...', err);
    try {
      return await attemptCall();
    } catch (retryErr) {
      console.error('Gemini API retry also failed:', retryErr);
      throw new Error('AI analysis failed, please try again');
    }
  }
};

module.exports = { generateJson };
