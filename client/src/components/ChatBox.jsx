import { useState } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';

export default function ChatBox({ botName = "Clazlo AI", welcomeMessage = "Hi! How can I help you today?" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: welcomeMessage },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    };

    const botResponse = {
      id: Date.now() + 1,
      sender: 'bot',
      text: `Sure! ${botName} says: I got your message and I am here to help.`,
    };

    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:bg-blue-500 transition-transform hover:scale-110 active:scale-95 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="flex items-center justify-between p-5 bg-blue-600 text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-200">AI Assistant</p>
              <h2 className="text-lg font-bold">{botName} Chat</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-5 space-y-4 max-h-[60vh] sm:max-h-96 overflow-y-auto bg-slate-50 dark:bg-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  message.sender === 'bot'
                    ? 'bg-white text-slate-900 dark:bg-gray-800 dark:text-white rounded-tl-sm border border-slate-100 dark:border-gray-700'
                    : 'bg-blue-600 text-white rounded-tr-sm ml-auto max-w-[85%]'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-500 shrink-0 shadow-md shadow-blue-500/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
