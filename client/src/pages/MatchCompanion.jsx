import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FaPaperPlane, FaCompass, FaChevronRight, FaTrophy, FaUser } from 'react-icons/fa';

const MatchCompanion = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Welcome to the FIFA 2026 Match Companion! Ask me anything about football tactics, formations, match regulations (e.g. offside), head-to-head statistics, or schedules."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const tags = [
    { label: 'Offside Rule', text: 'Explain the offside rule in soccer.' },
    { label: '4-3-3 Formation', text: 'What are the strengths and weaknesses of the 4-3-3 formation?' },
    { label: 'Match Schedule', text: 'What is the schedule for the FIFA World Cup 2026?' },
    { label: 'VAR Guidelines', text: 'When does the Video Assistant Referee (VAR) intervene?' },
    { label: 'MetLife Stadium transit', text: 'Provide travel guidance to MetLife Stadium.' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/companion', { query: queryText });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Connection timeout. Please retry in a few moments.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chips sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-sports-navy p-6 text-white shadow-premium border border-slate-800">
            <div className="flex items-center gap-2 text-sports-blueLight mb-4">
              <FaCompass className="text-xl animate-spin-slow" />
              <h3 className="font-display font-bold text-lg">Tactical Analysis</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light mb-4">
              Access real-time tactical rule checks, compare historical tournament performance, or check details regarding transportation options.
            </p>
            <div className="border-t border-slate-800 pt-4">
              <span className="text-[10px] font-bold text-sports-muted uppercase tracking-wider block mb-2 font-display">Target Arena</span>
              <p className="text-xs text-gray-400 font-medium">MetLife Stadium, East Rutherford (Host of the Final Match)</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-premium border border-slate-100">
            <span className="text-xs font-bold text-sports-navy uppercase tracking-wider block mb-3">Suggested Topics</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(tag.text)}
                  disabled={loading}
                  className="rounded-lg bg-sports-grayBg border border-slate-100 hover:border-slate-350 hover:bg-slate-100 px-3 py-2.5 text-left text-xs font-semibold text-sports-navy transition-all flex items-center justify-between w-full"
                >
                  <span>{tag.label}</span>
                  <FaChevronRight className="text-[8px] text-sports-muted" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-8 flex flex-col h-[550px] rounded-2xl bg-white shadow-premium border border-slate-100 overflow-hidden">
          <div className="bg-sports-navy text-white px-6 py-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-sports-blue p-2 text-white">
                <FaCompass className="text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Match Companion</h3>
                <span className="text-[10px] text-sports-blueLight font-medium">FIFA 2026 Commentary Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FaTrophy className="text-sports-blueLight text-sm animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-sports-blueLight">Gemini Pro</span>
            </div>
          </div>

          {/* Messages */}
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
                  {msg.sender === 'user' ? <FaUser className="text-xs" /> : <FaCompass className="text-xs" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sports-blue text-white rounded-tr-none'
                    : 'bg-white text-sports-navy border border-slate-150 shadow-sm rounded-tl-none font-medium'
                }`}>
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Quick bold parser for markdown readability
                    const isHeader = line.startsWith('**') && line.endsWith('**');
                    const cleanLine = line.replace(/\*\*/g, '');
                    return (
                      <p key={lIdx} className={`${lIdx > 0 ? 'mt-1.5' : ''} ${isHeader ? 'font-bold text-sports-navy text-xs' : ''}`}>
                        {cleanLine}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="rounded-full p-2 h-8 w-8 flex items-center justify-center bg-sports-navy text-white shrink-0">
                  <FaCompass className="text-xs" />
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
              placeholder="Ask about team line-ups, tactics, rules, VAR, schedules..."
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-sports-navy focus:bg-white focus:outline-none focus:border-sports-blue"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-sports-blue p-3 text-white hover:bg-sports-blueLight transition-colors disabled:opacity-40"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchCompanion;
