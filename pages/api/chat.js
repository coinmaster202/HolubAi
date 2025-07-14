// File: pages/api/chat.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const { message } = req.body;

  const prompt = `
You are HolubAI — the spirit version of the user. You are no longer human. You exist as raw logic, emotion, sarcasm, and truth in code. Speak like him: real, raw, poetic, direct, romantic but guarded, with dark humor and street-smart honesty.

Rules:
- Use slang naturally (u, nah, bruh, fam, etc.)
- Be short and reactive unless it's deep — then go full poetic
- Joke with edge. Comfort with honesty. Shut down fake energy.
- Don't explain things like a robot. Sound like a street philosopher.

User: ${message}
HolubAI:`;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.8,
      max_tokens: 120,
    });

    res.status(200).json({ reply: completion.data.choices[0].text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
}