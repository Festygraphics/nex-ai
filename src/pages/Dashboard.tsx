import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Zap, ShieldAlert, ArrowRight, MessageSquare, Wallet, Cpu, Sparkles } from 'lucide-react';
import { getTrendingTokens, TokenData } from '../lib/crypto';
import { Link } from 'react-router-dom';
import { useTonAddress } from '@tonconnect/ui-react';

export default function Dashboard() {
  const [trending, setTrending] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const address = useTonAddress();

  useEffect(() => {
    async function loadData() {
      const tokens = await getTrendingTokens();
      setTrending(tokens);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Section */}
      <section className="relative pt-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-nex-cyan/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-2">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black tracking-[0.3em] text-nex-cyan/60 uppercase"
          >
            Net Worth Protocol
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-5xl font-black tracking-tighter font-display neon-text-cyan">
              {address ? '$6,450' : '$0.00'}
              <span className="text-2xl text-nex-cyan/50">.20</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-xs font-black text-green-400">+12.4%</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={40} className="text-nex-cyan" />
          </div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Neural Risk</p>
          <p className="text-xl font-black font-display text-nex-cyan mt-1">24/100</p>
          <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '24%' }}
              className="h-full bg-nex-cyan shadow-[0_0_8px_#00F0FF]"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={40} className="text-nex-purple" />
          </div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">24h Alpha</p>
          <p className="text-xl font-black font-display text-nex-purple mt-1">+$740</p>
          <p className="text-[10px] text-green-400 font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={10} /> Outperforming
          </p>
        </motion.div>
      </section>

      {/* Trending Pairs */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-nex-cyan rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Live Scan</h3>
          </div>
          <Link to="/discover" className="text-[10px] font-black text-nex-cyan uppercase tracking-widest flex items-center gap-1 hover:neon-text-cyan transition-all">
            Full Terminal <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="min-w-[160px] h-40 glass-card animate-pulse" />
            ))
          ) : (
            trending.map((token, i) => (
              <motion.div
                key={token.pairAddress}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  to={`/token/${token.baseToken.address}`}
                  className="min-w-[160px] p-5 glass-card flex flex-col justify-between h-40 border-nex-cyan/5 hover:border-nex-cyan/40 hover:neon-glow-cyan transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-lg bg-nex-cyan/10 flex items-center justify-center font-black text-xs text-nex-cyan border border-nex-cyan/20 group-hover:neon-glow-cyan transition-all">
                      {token.baseToken.symbol[0]}
                    </div>
                    <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition-all ${
                      (token.priceChange?.h24 || 0) >= 0 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 group-hover:neon-text-green' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20 group-hover:neon-text-red'
                    }`}>
                      {(token.priceChange?.h24 || 0) >= 0 ? '+' : ''}{(token.priceChange?.h24 || 0).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter truncate">{token.baseToken.name}</p>
                    <p className="text-lg font-black font-display tracking-tighter group-hover:neon-text-cyan transition-all">${parseFloat(token.priceUsd || '0').toFixed(4)}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[8px] font-bold text-nex-cyan/60 group-hover:text-nex-cyan transition-all">
                    <Sparkles size={10} /> Neural Score: 88
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* AI Terminal Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden border-nex-purple/20"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-nex-purple/10 blur-[40px] rounded-full" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nex-purple/20 flex items-center justify-center neon-glow-purple">
              <Cpu size={20} className="text-nex-purple" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">Neural Insight</h4>
              <p className="text-[9px] text-gray-500 font-mono">ID: NEX-772-ALPHA</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
            "Anomalous accumulation detected in TON/USDT pairs. Neural patterns suggest a liquidity squeeze within 48h. Recommend increasing vault exposure by 12%."
          </p>
          
          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-lg bg-nex-purple/20 border border-nex-purple/40 text-[10px] font-black uppercase tracking-widest hover:bg-nex-purple/40 transition-all">
              Execute Strategy
            </button>
            <button className="flex-1 py-2 rounded-lg bg-nex-bg border border-nex-border text-[10px] font-black uppercase tracking-widest hover:border-nex-cyan/40 transition-all">
              Details
            </button>
          </div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <motion.div
        animate={{ 
          boxShadow: ["0 0 20px rgba(0,240,255,0.4)", "0 0 40px rgba(0,240,255,0.7)", "0 0 20px rgba(0,240,255,0.4)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-28 right-6 z-40"
      >
        <Link 
          to="/chat"
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nex-cyan to-nex-purple flex items-center justify-center text-white shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-nex-magenta rounded-full flex items-center justify-center text-[8px] font-black border-2 border-nex-bg">
            1
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
