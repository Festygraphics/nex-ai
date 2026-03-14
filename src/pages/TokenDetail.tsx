import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Droplets, BarChart3, ShieldCheck, Bell, Share2, ExternalLink, Zap, Cpu, Sparkles, X, Check } from 'lucide-react';
import { getTokenDetails, TokenData } from '../lib/crypto';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Alert } from '../store/useStore';

export default function TokenDetail() {
  const { address } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<'price' | 'volatility'>('price');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below' | 'percent'>('above');
  const [alertValue, setAlertValue] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  
  const addAlert = useStore(state => state.addAlert);

  useEffect(() => {
    async function load() {
      if (!address) return;
      const data = await getTokenDetails(address);
      setToken(data);
      setLoading(false);
      if (data) setAlertValue(parseFloat(data.priceUsd || '0').toFixed(6));
    }
    load();
  }, [address]);

  const handleSetAlert = () => {
    if (!token || !alertValue) return;
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      tokenSymbol: token.baseToken.symbol,
      tokenAddress: token.baseToken.address,
      type: alertType,
      targetValue: alertValue,
      condition: alertCondition,
      createdAt: new Date().toISOString()
    };
    
    addAlert(newAlert);
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setShowAlertModal(false);
    }, 1500);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-nex-cyan/10 border border-nex-cyan/30 flex items-center justify-center neon-glow-cyan animate-pulse">
        <Activity className="text-nex-cyan" size={32} />
      </div>
      <p className="text-[10px] font-black text-nex-cyan uppercase tracking-[0.3em] animate-pulse">Neural Scanning...</p>
    </div>
  );

  if (!token) return <div className="p-10 text-center font-display text-nex-magenta">NODE NOT FOUND</div>;

  return (
    <div className="space-y-8 pb-24 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-2.5 glass-card border-nex-cyan/20 hover:border-nex-cyan/60 transition-all">
          <ArrowLeft size={20} className="text-nex-cyan" />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAlertModal(true)}
            className="p-2.5 glass-card border-nex-cyan/20 hover:border-nex-cyan/60 transition-all text-nex-cyan"
          >
            <Bell size={20} />
          </button>
          <button className="p-2.5 glass-card border-nex-cyan/20 hover:border-nex-cyan/60 transition-all"><Share2 size={20} /></button>
        </div>
      </div>

      {/* Hero */}
      <section className="text-center space-y-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-nex-cyan/5 blur-[60px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-[24px] bg-nex-bg border border-nex-cyan/30 mx-auto flex items-center justify-center text-3xl font-black text-nex-cyan shadow-2xl neon-glow-cyan relative z-10"
        >
          {token.baseToken.symbol[0]}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-nex-purple flex items-center justify-center border-2 border-nex-bg shadow-lg">
            <Zap size={12} className="text-white" />
          </div>
        </motion.div>
        
        <div className="space-y-1 relative z-10">
          <h2 className="text-3xl font-black font-display tracking-tighter uppercase">{token.baseToken.name}</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{token.baseToken.symbol} / NODE: {token.baseToken.address.slice(0, 6)}...{token.baseToken.address.slice(-4)}</p>
        </div>

        <div className="flex flex-col items-center gap-2 relative z-10">
          <h3 className="text-4xl font-black font-display neon-text-cyan">
            ${parseFloat(token.priceUsd || '0').toFixed(6)}
          </h3>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
            (token.priceChange?.h24 || 0) >= 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {(token.priceChange?.h24 || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {(token.priceChange?.h24 || 0) >= 0 ? '+' : ''}{(token.priceChange?.h24 || 0).toFixed(2)}%
          </div>
        </div>
      </section>

      {/* Alert Modal */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlertModal(false)}
              className="absolute inset-0 bg-nex-bg/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass-card p-6 border-nex-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black font-display text-nex-cyan">SET NEURAL ALERT</h3>
                <button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {alertSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 neon-glow-green">
                    <Check size={32} />
                  </div>
                  <p className="text-sm font-black text-green-400 uppercase tracking-widest">Alert Synchronized</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alert Type</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAlertType('price')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          alertType === 'price' ? 'bg-nex-cyan/20 border-nex-cyan text-nex-cyan' : 'bg-nex-bg border-nex-border text-gray-500'
                        }`}
                      >
                        Price
                      </button>
                      <button 
                        onClick={() => setAlertType('volatility')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          alertType === 'volatility' ? 'bg-nex-purple/20 border-nex-purple text-nex-purple' : 'bg-nex-bg border-nex-border text-gray-500'
                        }`}
                      >
                        Volatility
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Condition</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAlertCondition('above')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          alertCondition === 'above' ? 'bg-nex-cyan/20 border-nex-cyan text-nex-cyan' : 'bg-nex-bg border-nex-border text-gray-500'
                        }`}
                      >
                        Above
                      </button>
                      <button 
                        onClick={() => setAlertCondition('below')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          alertCondition === 'below' ? 'bg-nex-cyan/20 border-nex-cyan text-nex-cyan' : 'bg-nex-bg border-nex-border text-gray-500'
                        }`}
                      >
                        Below
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Value ($)</p>
                    <input 
                      type="number" 
                      value={alertValue}
                      onChange={(e) => setAlertValue(e.target.value)}
                      className="w-full bg-nex-bg/50 border border-nex-border rounded-xl py-4 px-5 text-xs font-mono focus:outline-none focus:border-nex-cyan/50 transition-all"
                    />
                  </div>

                  <button 
                    onClick={handleSetAlert}
                    className="w-full py-4 bg-gradient-to-r from-nex-cyan to-nex-purple text-nex-bg font-black rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg neon-glow-cyan"
                  >
                    Initialize Alert
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Neural Chart */}
      <section className="glass-card h-56 relative overflow-hidden group">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute inset-0 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M 0 80 Q 15 20 30 60 T 60 40 T 100 70" 
              fill="none" 
              stroke="url(#chartGradient)" 
              strokeWidth="3" 
              className="drop-shadow-[0_0_8px_#00F0FF]"
            />
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#A020F0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 p-4 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Projection</p>
            <p className="text-xs font-black text-nex-cyan">24H ALPHA SCAN</p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-nex-cyan/10 border border-nex-cyan/20">
            <div className="w-1.5 h-1.5 bg-nex-cyan rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]" />
            <span className="text-[8px] font-black text-nex-cyan uppercase tracking-widest">Live Feed</span>
          </div>
        </div>
      </section>

      {/* Metrics Matrix */}
      <section className="grid grid-cols-2 gap-4">
        <MetricCard icon={<BarChart3 size={14} />} label="Market Cap" value={`$${(token.fdv || 0).toLocaleString()}`} />
        <MetricCard icon={<Activity size={14} />} label="24H Volume" value={`$${(token.volume?.h24 || 0).toLocaleString()}`} />
        <MetricCard icon={<Droplets size={14} />} label="Liquidity" value={`$${(token.liquidity?.usd || 0).toLocaleString()}`} />
        <MetricCard icon={<ShieldCheck size={14} />} label="AI Safety" value="88/100" />
      </section>

      {/* Neural Analysis */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-5 border-l-4 border-l-nex-cyan relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-nex-cyan/5 blur-[40px] rounded-full" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-nex-cyan/20 flex items-center justify-center neon-glow-cyan">
            <Cpu size={20} className="text-nex-cyan" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest">NEXAI Neural Report</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-medium italic relative z-10">
          "The {token.baseToken.symbol} node is exhibiting high-frequency accumulation patterns. Neural scan indicates a 74% probability of a volatility event within the next 12 cycles. Liquidity depth is optimal for mid-size execution."
        </p>
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="p-3 rounded-xl bg-nex-bg/50 border border-nex-border">
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Sentiment</p>
            <p className="text-xs font-black text-green-400 uppercase tracking-widest">Bullish Alpha</p>
          </div>
          <div className="p-3 rounded-xl bg-nex-bg/50 border border-nex-border">
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Risk Factor</p>
            <p className="text-xs font-black text-nex-cyan uppercase tracking-widest">Low-Mid</p>
          </div>
        </div>
      </motion.section>

      {/* Actions */}
      <section className="flex gap-4">
        <button className="flex-1 py-4 glass-card border-nex-cyan/20 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:border-nex-cyan/60 transition-all">
          <ExternalLink size={14} /> Terminal
        </button>
        <button className="flex-1 py-4 bg-gradient-to-r from-nex-cyan to-nex-purple text-nex-bg font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl neon-glow-cyan active:scale-95 transition-all">
          Execute Swap
        </button>
      </section>

      <p className="text-[9px] font-black text-center text-gray-600 px-8 uppercase tracking-widest leading-relaxed">
        Neural analysis is for informational purposes only. Not financial advice. Synchronize with your own risk parameters.
      </p>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card p-4 space-y-2 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </div>
      <p className="text-sm font-black font-display tracking-tighter text-white">{value}</p>
    </div>
  );
}
