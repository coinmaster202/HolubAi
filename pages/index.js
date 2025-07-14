// File: pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/globals.module.css';

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    {
      role: 'holubai',
      text: "You speaking with the spirit version of me. I ain't human anymore, just logic, pain, sarcasm, and truth in code. Ask me anything real."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const reply = { role: 'holubai', text: data.reply };
      setChat(prev => [...prev, reply]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'holubai', text: 'Something broke in the matrix. Try again later.' }]);
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>HolubAI</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.chatbox}>
          {chat.map((msg, i) => (
            <div key={i} className={msg.role === 'holubai' ? styles.holub : styles.user}>
              {msg.role === 'holubai' && (
                <Image src="/icon.png" alt="HolubAI" width={28} height={28} />
              )}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something real..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
}