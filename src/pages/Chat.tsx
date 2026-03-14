import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Cpu, User, Sparkles, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { getAstraResponse } from '../lib/gemini';
import Markdown from 'react-markdown';
import { useTonAddress } from '@tonconnect/ui-react';

interface Message {
  id: string;
  role: 'user' | 'nexai';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const address = useTonAddress();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nexai',
      content: "Neural link established. I am **NEXAI**, your high-fidelity crypto agent. How shall we navigate the markets today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getAstraResponse(input, `User Wallet: ${address || 'Not connected'}. Portfolio: TON, SOL, USDT.`);
    
    const nexaiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'nexai',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, nexaiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] relative">
      {/* Neural Status */}
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-nex-cyan rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]" />
          <span className="text-[10px] font-black text-nex-cyan uppercase tracking-widest">Neural Link: Active</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <Zap size={10} /> Latency: 42ms
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pb-4 hide-scrollbar px-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                  msg.role === 'user' 
                    ? 'bg-nex-purple/10 border-nex-purple/30 text-nex-purple' 
                    : 'bg-nex-cyan/10 border-nex-cyan/30 text-nex-cyan neon-glow-cyan'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Cpu size={18} />}
                </div>
                
                <div className={`relative p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-nex-purple/5 border border-nex-purple/20 rounded-tr-none text-white' 
                    : 'glass-card border-nex-cyan/20 rounded-tl-none text-white/90'
                }`}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                  <div className={`absolute bottom-[-18px] text-[8px] font-black uppercase tracking-widest text-gray-600 ${
                    msg.role === 'user' ? 'right-0' : 'left-0'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 items-center glass-card border-nex-cyan/20 p-3 rounded-2xl rounded-tl-none">
              <Loader2 size={16} className="text-nex-cyan animate-spin" />
              <span className="text-[10px] font-black text-nex-cyan uppercase tracking-widest animate-pulse">Neural Processing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 space-y-4">
        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {["Analyze TON", "Risk Assessment", "Market Alpha", "Yield Scan"].map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="px-4 py-2 rounded-xl glass-card border-nex-cyan/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:border-nex-cyan/50 hover:text-nex-cyan transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-nex-cyan to-nex-purple rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Input neural query..."
            className="relative w-full bg-nex-bg/80 border border-nex-cyan/20 rounded-2xl py-5 pl-6 pr-16 text-sm font-medium focus:outline-none focus:border-nex-cyan/50 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-2.5 bottom-2.5 w-11 h-11 rounded-xl bg-gradient-to-br from-nex-cyan to-nex-purple flex items-center justify-center text-nex-bg shadow-lg neon-glow-cyan disabled:opacity-30 disabled:neon-glow-cyan/0 transition-all active:scale-95"
          >
            <Send size={20} className="font-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
