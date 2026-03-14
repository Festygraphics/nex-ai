import React, { useState, useEffect } from 'react';
import { Search, Flame, Star, Zap, ArrowUpRight, ShieldCheck, Info, Sparkles, Activity } from 'lucide-react';
import { getTrendingTokens, TokenData } from '../lib/crypto';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Discover() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getTrendingTokens();
      setTokens(data);
      setLoading(false);
    }
    load();
  }, [filter]);

  return (
    <div className="space-y-8 pb-24">
      {/* Search Terminal */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-nex-cyan to-nex-purple rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition-opacity" />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-nex-cyan/50" size={18} />
        <input 
          type="text" 
          placeholder="SCAN NETWORK FOR NODES..."
          className="relative w-full bg-nex-bg/80 border border-nex-cyan/20 rounded-2xl py-5 pl-14 pr-4 text-[10px] font-black tracking-[0.2em] uppercase focus:outline-none focus:border-nex-cyan/50 transition-all placeholder:text-gray-700"
        />
      </section>

      {/* Neural Filters */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar px-1">
        {[
          { id: 'trending', label: 'Trending', icon: <Flame size={14} /> },
          { id: 'new', label: 'Alpha Pairs', icon: <Zap size={14} /> },
          { id: 'gainers', label: 'Top Velocity', icon: <ArrowUpRight size={14} /> },
          { id: 'safe', label: 'Neural Safe', icon: <ShieldCheck size={14} /> },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === f.id 
                ? 'bg-nex-cyan text-nex-bg border-nex-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                : 'bg-nex-glass border-nex-border text-gray-500 hover:border-nex-cyan/30'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </section>

      {/* Referral Matrix */}
      <motion.section 
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-[24px] bg-gradient-to-br from-nex-purple/30 to-nex-magenta/30 border border-nex-purple/40 relative overflow-hidden group"
      >
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Star size={120} className="text-nex-magenta" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-nex-magenta rounded-full animate-pulse shadow-[0_0_8px_#FF00AA]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-nex-magenta">Network Expansion</h4>
          </div>
          <h4 className="text-lg font-black font-display tracking-tight">Recruit New Operatives</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Expand the NEXAI neural network. Earn 0.5 TON + 7 cycles of Pro access for every successful uplink.</p>
          <button className="px-5 py-2 bg-nex-magenta text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg hover:shadow-[0_0_20px_rgba(255,0,170,0.4)] transition-all">
            Generate Invite Link
          </button>
        </div>
      </motion.section>

      {/* Node List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Node / Protocol</span>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Alpha / 24H</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-24 glass-card animate-pulse" />
            ))
          ) : (
            tokens.map((token, i) => (
              <motion.div
                key={token.pairAddress}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link 
                  to={`/token/${token.baseToken.address}`}
                  className="glass-card p-5 flex justify-between items-center hover:border-nex-cyan/40 hover:bg-nex-cyan/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-nex-bg border border-nex-border flex items-center justify-center font-black text-sm text-nex-cyan group-hover:neon-glow-cyan transition-all">
                      {token.baseToken.symbol[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black tracking-tight">{token.baseToken.symbol}</p>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-nex-cyan/10 border border-nex-cyan/20">
                          <Sparkles size={8} className="text-nex-cyan" />
                          <span className="text-[8px] font-black text-nex-cyan">88</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter truncate w-32">{token.baseToken.name}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-black font-display tracking-tighter">${parseFloat(token.priceUsd || '0').toFixed(4)}</p>
                    <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${
                      (token.priceChange?.h24 || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(token.priceChange?.h24 || 0) >= 0 ? <ArrowUpRight size={10} /> : <Activity size={10} />}
                      {(token.priceChange?.h24 || 0) >= 0 ? '+' : ''}{(token.priceChange?.h24 || 0).toFixed(2)}%
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
