import React, { useState } from 'react';
import { Bot, Send, Leaf } from 'lucide-react';

const suggestions = [
  'What is the best time to plant tomatoes in Karnataka?',
  'How to control pest attacks on onion crop?',
  'Tips for organic farming certification',
  'How to improve soil health naturally?',
];

const autoResponses: Record<string, string> = {
  default: "Thank you for your question! As an AI farming assistant, I'd recommend consulting your local agricultural extension officer for region-specific advice. Here are some general tips:\n\n• Regularly test your soil pH\n• Use crop rotation to maintain soil health\n• Monitor weather forecasts before irrigation\n• Keep records of all farming activities for better planning",
  tomato: "🍅 **Best time to plant tomatoes in Karnataka:**\n\n• Kharif season: June–July (rainy season)\n• Rabi season: October–November\n• Summer crop: January–February\n\nTips: Use drip irrigation, maintain pH 6.0–7.0, apply organic compost before planting.",
  pest: "🐛 **Pest control for onions:**\n\n• Thrips: Use neem oil spray (5ml/litre)\n• Purple Blotch: Apply mancozeb fungicide\n• Stem borer: Use pheromone traps\n• Basal rot: Treat seeds with Trichoderma\n\nAlways use organic or approved pesticides.",
};

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am your AI farming assistant. Ask me anything about crops, soil, irrigation, pests, or organic farming. 🌱' },
  ]);
  const [input, setInput] = useState('');

  const send = (text?: string) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setTimeout(() => {
      const lq = q.toLowerCase();
      let reply = autoResponses.default;
      if (lq.includes('tomato')) reply = autoResponses.tomato;
      else if (lq.includes('pest') || lq.includes('onion')) reply = autoResponses.pest;
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-4" style={{ maxHeight: 'calc(100vh - 80px)' }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">AI Farming Assistant</h1>
        <p className="text-gray-500 text-sm">Get expert advice on crops, soil and farming</p>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 flex-wrap">
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)}
            className="text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition">
            {s}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow flex flex-col overflow-hidden min-h-80">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-green-600" />
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf size={14} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about crops, pest control, irrigation..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          <button onClick={() => send()}
            className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 transition">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
