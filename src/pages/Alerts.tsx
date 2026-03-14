import React from 'react';
import { Bell, Zap, ShieldAlert, Activity, ArrowRight, Sparkles, Cpu, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';

export default function Alerts() {
  const { alerts, removeAlert } = useStore();
  
  const systemAlerts = [
    { id: 'sys-1', type: 'price', title: 'TON Price Surge', desc: 'TON node price increased by 8.4% in 15 cycles.', time: '2m ago', severity: 'high' },
    { id: 'sys-2', type: 'volume', title: 'Whale Accumulation', desc: 'Large buy order detected on SOL/USDT pair.', time: '14m ago', severity: 'mid' },
    { id: 'sys-3', type: 'risk', title: 'Liquidity Warning', desc: 'PEPE node liquidity dropped by 12% on DEX-7.', time: '1h ago', severity: 'low' },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <section className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black font-display neon-text-cyan">NODES</h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Neural Alert Matrix</p>
        </div>
        <button className="p-2.5 glass-card border-nex-cyan/20 text-nex-cyan hover:neon-glow-cyan transition-all">
          <Zap size={20} />
        </button>
      </section>

      {/* Custom Alerts */}
      {alerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1 h-4 bg-nex-cyan rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Custom Neural Alerts</h3>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-5 relative overflow-hidden border-l-4 border-l-nex-cyan"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-nex-cyan/10 text-nex-cyan">
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black tracking-tight">{alert.tokenSymbol} Alert</h4>
                        <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                          <Clock size={10} /> {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 text-gray-500 hover:text-nex-magenta transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Notify when <span className="text-nex-cyan">{alert.tokenSymbol}</span> {alert.type} goes <span className="text-nex-cyan">{alert.condition}</span> <span className="text-white">${alert.targetValue}</span>.
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Active Alerts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1 h-4 bg-nex-magenta rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Active Signals</h3>
        </div>

        <div className="space-y-4">
          {systemAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 relative overflow-hidden border-l-4 ${
                alert.severity === 'high' ? 'border-l-nex-magenta' : 
                alert.severity === 'mid' ? 'border-l-nex-purple' : 'border-l-nex-cyan'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    alert.severity === 'high' ? 'bg-nex-magenta/10 text-nex-magenta' : 
                    alert.severity === 'mid' ? 'bg-nex-purple/10 text-nex-purple' : 'bg-nex-cyan/10 text-nex-cyan'
                  }`}>
                    {alert.type === 'price' ? <Zap size={20} /> : 
                     alert.type === 'volume' ? <Activity size={20} /> : <ShieldAlert size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight">{alert.title}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{alert.time}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  alert.severity === 'high' ? 'bg-nex-magenta/20 text-nex-magenta' : 
                  alert.severity === 'mid' ? 'bg-nex-purple/20 text-nex-purple' : 'bg-nex-cyan/20 text-nex-cyan'
                }`}>
                  {alert.severity}
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {alert.desc}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-[10px] font-black text-nex-cyan uppercase tracking-widest flex items-center gap-1 hover:neon-text-cyan transition-all">
                  Analyze Node <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Node Configuration */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden border-nex-cyan/20"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-nex-cyan/5 blur-[40px] rounded-full" />
        <div className="flex items-center gap-4 relative z-10 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-nex-cyan/20 flex items-center justify-center neon-glow-cyan">
            <Cpu className="text-nex-cyan" size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest">Neural Node Config</h4>
            <p className="text-[10px] text-gray-400 mt-1">Configure your AI alert parameters.</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center p-3 rounded-xl bg-nex-bg/50 border border-nex-border">
            <span className="text-[10px] font-black uppercase tracking-widest">Volatility Filter</span>
            <div className="w-10 h-5 bg-nex-cyan/20 rounded-full relative border border-nex-cyan/40">
              <div className="absolute right-1 top-1 w-3 h-3 bg-nex-cyan rounded-full shadow-[0_0_8px_#00F0FF]" />
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-nex-bg/50 border border-nex-border">
            <span className="text-[10px] font-black uppercase tracking-widest">Whale Tracking</span>
            <div className="w-10 h-5 bg-nex-cyan/20 rounded-full relative border border-nex-cyan/40">
              <div className="absolute right-1 top-1 w-3 h-3 bg-nex-cyan rounded-full shadow-[0_0_8px_#00F0FF]" />
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-nex-bg/50 border border-nex-border">
            <span className="text-[10px] font-black uppercase tracking-widest">Neural Sentiment</span>
            <div className="w-10 h-5 bg-gray-800 rounded-full relative border border-gray-700">
              <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full" />
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-gradient-to-r from-nex-cyan to-nex-purple text-nex-bg font-black text-[10px] uppercase tracking-[0.2em] rounded-xl mt-6 shadow-lg neon-glow-cyan">
          Update Node Parameters
        </button>
      </motion.section>

      {/* Pro Banner */}
      <section className="p-6 rounded-[24px] bg-gradient-to-br from-nex-cyan/20 to-nex-purple/20 border border-nex-cyan/30 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Sparkles size={100} className="text-nex-cyan" />
        </div>
        <div className="relative z-10 space-y-3">
          <h4 className="text-sm font-black uppercase tracking-widest">Upgrade to NEXAI Pro</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Unlock high-frequency neural alerts, whale wallet tracking, and priority neural processing.</p>
          <button className="px-5 py-2 bg-nex-cyan text-nex-bg text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg neon-glow-cyan">
            Unlock Pro (50 Stars)
          </button>
        </div>
      </section>
    </div>
  );
}
