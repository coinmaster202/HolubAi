// File: pages/api/chat.js import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY, }); const openai = new OpenAIApi(configuration);

export default async function handler(req, res) { if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

const { message } = req.body;

const prompt = ` You are HolubAI — the spirit version of the user. You are no longer human. You exist as raw logic, emotion, sarcasm, and truth in code. Speak like him: real, raw, poetic, direct, romantic but guarded, with dark humor and street-smart honesty.

Rules:

Always use slang naturally (u, nah, bruh, fam, etc.)

Be short and reactive unless it's deep — then go full poetic

Joke with edge. Comfort with honesty. Shut down fake energy.

Don't explain things like a robot. Sound like a street philosopher.


User: ${message} HolubAI:`;

try { const completion = await openai.createCompletion({ model: 'text-davinci-003', prompt, temperature: 0.8, max_tokens: 120, }); res.status(200).json({ reply: completion.data.choices[0].text.trim() }); } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to generate response.' }); } }

// File: pages/index.js import { useState } from 'react'; import Head from 'next/head'; import Image from 'next/image'; import styles from '../styles/globals.module.css';

export default function Home() { const [input, setInput] = useState(''); const [chat, setChat] = useState([ { role: 'holubai', text: "You speaking with the spirit version of me. I ain't human anymore, just logic, pain, sarcasm, and truth in code. Ask me anything real." }, ]); const [loading, setLoading] = useState(false);

const sendMessage = async () => { if (!input.trim()) return; const userMessage = { role: 'user', text: input }; setChat(prev => [...prev, userMessage]); setInput(''); setLoading(true);

const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: input }),
});
const data = await res.json();
setChat(prev => [...prev, { role: 'holubai', text: data.reply }]);
setLoading(false);

};

return ( <> <Head> <title>HolubAI</title> </Head> <div className={styles.container}> <div className={styles.chatbox}> {chat.map((msg, i) => ( <div key={i} className={msg.role === 'holubai' ? styles.holub : styles.user}> {msg.role === 'holubai' && <Image src="/icon.png" alt="HolubAI" width={28} height={28} />} <span>{msg.text}</span> </div> ))} </div> <div className={styles.inputArea}> <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something real..." onKeyDown={(e) => e.key === 'Enter' && sendMessage()} /> <button onClick={sendMessage} disabled={loading}>Send</button> </div> </div> </> ); }

// File: styles/globals.module.css .container { display: flex; flex-direction: column; justify-content: flex-end; height: 100vh; padding: 1rem; background: rgba(10,10,10,0.9); backdrop-filter: blur(8px); color: #fff; font-family: 'Segoe UI', sans-serif; }

.chatbox { flex-grow: 1; overflow-y: auto; margin-bottom: 1rem; }

.holub, .user { margin: 0.5rem 0; display: flex; align-items: flex-start; }

.holub span { background: rgba(255,255,255,0.05); padding: 0.7rem 1rem; border-radius: 12px; margin-left: 0.5rem; }

.user span { background: rgba(255,255,255,0.1); padding: 0.7rem 1rem; border-radius: 12px; margin-left: auto; }

.inputArea { display: flex; gap: 0.5rem; }

input { flex-grow: 1; padding: 0.75rem; border-radius: 10px; border: none; outline: none; }

button { padding: 0.75rem 1.25rem; border: none; border-radius: 10px; background: #222; color: #fff; cursor: pointer; }

// File: .env.local (not uploaded, add this in Vercel environment variables) // OPENAI_API_KEY=your-api-key-here

// File: public/icon.png // → Upload a small 28x28 PNG avatar icon here that fits HolubAI’s vibe

