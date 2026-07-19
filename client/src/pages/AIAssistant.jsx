import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaPaperPlane, FaRobot, FaUser, FaCompass, FaChevronRight } from 'react-icons/fa';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your FIFA 2026 Smart Stadium Assistant. Ask me about gates, restrooms, food courts, parking, emergency exits, wheelchair accessibility, lost & found, or transport connections."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    { label: 'Closest Gate', text: 'Which gate should I use for Section 112?' },
    { label: 'Find Restrooms', text: 'Where is the nearest restroom in the East Concourse?' },
    { label: 'Food Wait Times', text: 'Which food courts have the shortest queue right now?' },
    { label: 'Disabled Ramps', text: 'What accessibility options exist for wheelchair entrance?' },
    { label: 'Parking Slots', text: 'Where should I park for quick access to Gate C?' },
    { label: 'Lost & Found', text: 'Where is the lost and found center?' }
  ];

  // Auto-scroll chats
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    // Append user query to chat logs
    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { query: queryText });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I am experiencing network problems. Please try again in a few moments.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Helper sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-sports-navy p-6 text-white shadow-premium border border-slate-800">
            <div className="flex items-center gap-2 text-sports-blueLight mb-4">
              <FaRobot className="text-xl" />
              <h3 className="font-display font-bold text-lg">Gemini Intelligence</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light mb-4">
              The assistant monitors active stadium sensors and gate counts to direct you to empty exits, restrooms, and food stands.
            </p>
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-[10px] font-bold text-sports-muted uppercase tracking-wider block">Standard Operations</span>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Gate A & D status:</span>
                <span className="text-sports-success font-semibold">Clear</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Gate B bottleneck:</span>
                <span className="text-sports-danger font-semibold">28m wait</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-3">Quick Queries</span>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  disabled={loading}
                  className="rounded-lg bg-sports-grayBg border border-slate-100 hover:border-slate-300 hover:bg-slate-100 px-3 py-2 text-left text-xs font-medium text-sports-navy transition-all flex items-center justify-between w-full focus:outline-none focus:ring-2 focus:ring-sports-blueLight"
                >
                  <span>{chip.label}</span>
                  <FaChevronRight className="text-[8px] text-sports-muted" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="lg:col-span-8 flex flex-col h-[550px] rounded-2xl bg-white shadow-premium border border-slate-100 overflow-hidden" role="log" aria-label="Stadium Assistant Chat History">
          <div className="bg-sports-navy text-white px-6 py-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-sports-blue p-2 text-white">
                <FaRobot className="text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Stadium Assistant Chat</h3>
                <span className="text-[10px] text-sports-blueLight font-medium">Gemini Pro-Active guidance</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sports-success animate-ping" aria-hidden="true"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sports-success">Telemetry Online</span>
            </div>
          </div>

          {/* Messages block */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`rounded-full p-2 h-8 w-8 flex items-center justify-center text-white shrink-0 ${msg.sender === 'user' ? 'bg-sports-blue' : 'bg-sports-navy'}`}>
                  {msg.sender === 'user' ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sports-blue text-white rounded-tr-none'
                    : 'bg-white text-sports-navy border border-slate-150 shadow-sm rounded-tl-none font-medium'
                }`}>
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%]" aria-live="polite" aria-busy="true">
                <div className="rounded-full p-2 h-8 w-8 flex items-center justify-center bg-sports-navy text-white shrink-0">
                  <FaRobot className="text-xs" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-slate-150 shadow-sm rounded-tl-none flex gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-sports-blue animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-sports-blue animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-sports-blue animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-slate-100 flex gap-2 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about parking, nearest restroom, security queues..."
              aria-label="Ask a stadium question"
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue focus:ring-2 focus:ring-sports-blueLight"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send Message"
              className="rounded-lg bg-sports-blue p-3 text-white hover:bg-sports-blueLight transition-colors disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-sports-blueLight"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
