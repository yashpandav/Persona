import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import img from './img.png';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data }]);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Chat Bot</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow-sm mb-4 p-4 overflow-y-auto min-h-[500px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 mb-4 ${message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
            >
              <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                {message.role === 'user' ? <User size={20} /> : <img src={img} style={
                  { width: '50px', height: '50px', borderRadius: '50%' }
                }></img>}
              </div>
              <div className={`flex-1 rounded-lg p-4 ${message.role === 'user'
                ? 'bg-blue-500 text-white ml-12'
                : 'bg-gray-100 mr-12'
                }`}>
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <img src={img} style={
                { width: '50px', height: '50px', borderRadius: '50%' }
              }></img>              <div className="animate-pulse">Ruko...</div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;