import React, { useState } from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownRight, Share2, RefreshCw, Link as LinkIcon, Globe, ShieldCheck, Cpu, Zap, Sparkles } from 'lucide-react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

const portfolioData = [
  { name: 'TON', value: 45, color: '#00F0FF' },
  { name: 'SOL', value: 25, color: '#A020F0' },
  { name: 'USDT', value: 20, color: '#FF00AA' },
  { name: 'Others', value: 10, color: '#4b5563' },
];

const tokens = [
  { name: 'Toncoin', symbol: 'TON', amount: '1,240.50', value: '$6,450.20', pnl: '+12.4%', positive: true },
  { name: 'Solana', symbol: 'SOL', amount: '15.20', value: '$2,140.10', pnl: '+5.2%', positive: true },
  { name: 'Tether', symbol: 'USDT', amount: '1,200.00', value: '$1,200.00', pnl: '0.0%', positive: true },
  { name: 'Pepe', symbol: 'PEPE', amount: '45.2M', value: '$450.50', pnl: '-8.4%', positive: false },
];

export default function Portfolio() {
  const address = useTonAddress();
  const { manualAddress, chain, setManualAddress } = useStore();
  const [inputAddress, setInputAddress] = useState(manualAddress || '');
  const [selectedChain, setSelectedChain] = useState<'TON' | 'SOL' | 'ETH'>(chain);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSaveManual = () => {
    setManualAddress(inputAddress, selectedChain);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const isConnected = !!address || !!manualAddress;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 text-center px-6">
        <motion.div 
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 rounded-[32px] bg-nex-cyan/10 flex items-center justify-center neon-glow-cyan border border-nex-cyan/30"
        >
          <Wallet className="text-nex-cyan w-12 h-12" />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black font-display neon-text-cyan">VAULT OFFLINE</h2>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">Neural access required. Connect your wallet or provide a node address to synchronize assets.</p>
        </div>
        
        <div className="w-full space-y-4 pt-4">
          <div className="p-6 glass-card space-y-5 border-nex-cyan/20">
            <p className="text-[10px] font-black text-nex-cyan uppercase tracking-[0.3em]">Manual Node Entry</p>
            <div className="flex gap-2">
              {['TON', 'SOL', 'ETH'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedChain(c as any)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest border transition-all ${
                    selectedChain === c ? 'bg-nex-cyan/20 border-nex-cyan text-nex-cyan neon-glow-cyan' : 'bg-nex-bg border-nex-border text-gray-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder={`Enter ${selectedChain} address...`}
              className="w-full bg-nex-bg/50 border border-nex-border rounded-xl py-4 px-5 text-xs font-mono focus:outline-none focus:border-nex-cyan/50 transition-all"
            />
            <button 
              onClick={handleSaveManual}
              className="w-full py-4 bg-gradient-to-r from-nex-cyan to-nex-purple text-nex-bg font-black rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg neon-glow-cyan"
            >
              Initialize Sync
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Allocation Hero */}
      <section className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-nex-cyan/10 blur-[40px] rounded-full" />
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Vault Allocation</h3>
            <p className="text-2xl font-black font-display text-white mt-1">Neural Distribution</p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-nex-cyan/10 border border-nex-cyan/20 text-nex-cyan hover:neon-glow-cyan transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0015', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#00F0FF', fontWeight: 'bold' }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-black text-gray-500 uppercase">Total</p>
            <p className="text-xl font-black font-display text-nex-cyan">$6.4k</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {portfolioData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
              <span className="text-[10px] font-black text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Asset List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Matrix</h3>
          <button className="text-[10px] font-black text-nex-cyan uppercase tracking-widest flex items-center gap-1">
            <Share2 size={12} /> Export Report
          </button>
        </div>

        <div className="space-y-3">
          {tokens.map((token, i) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 flex justify-between items-center hover:border-nex-cyan/40 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-nex-bg border border-nex-border flex items-center justify-center font-black text-sm text-nex-cyan group-hover:neon-glow-cyan transition-all">
                  {token.symbol[0]}
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight">{token.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{token.amount} {token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black font-display">{token.value}</p>
                <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${token.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {token.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {token.pnl}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Rebalance Card */}
      <motion.section 
        whileHover={{ scale: 1.02 }}
        className="glass-card p-6 border-nex-cyan/30 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-nex-cyan/5 to-nex-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-nex-cyan/20 flex items-center justify-center neon-glow-cyan">
            <Sparkles className="text-nex-cyan" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase tracking-widest">Neural Rebalance</h4>
            <p className="text-[10px] text-gray-400 mt-1">Optimize your vault for current market alpha.</p>
          </div>
          <button className="px-4 py-2 bg-nex-cyan text-nex-bg text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg neon-glow-cyan">
            Optimize
          </button>
        </div>
      </motion.section>
    </div>
  );
}
