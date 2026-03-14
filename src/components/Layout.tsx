import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, PieChart, Compass, Bell, Cpu, Zap } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useStore } from '../store/useStore';
import { getSupabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, webApp } = useTelegram();
  const address = useTonAddress();
  const setWalletAddress = useStore(state => state.setWalletAddress);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (address) {
      setWalletAddress(address);
      if (user && supabase) {
        supabase.from('users').upsert({
          id: user.id,
          wallet_address: address,
          last_seen: new Date().toISOString()
        }).then();
      }
    } else {
      setWalletAddress(null);
    }
  }, [address, user, setWalletAddress]);

  return (
    <div className="flex flex-col min-h-screen max-w-[390px] mx-auto relative bg-nex-bg overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanline opacity-30 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nex-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nex-purple/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className={`p-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-nex-bg/80 backdrop-blur-xl border-b border-nex-cyan/20' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-nex-cyan to-nex-purple p-[1px] neon-glow-cyan"
          >
            <div className="w-full h-full rounded-xl bg-nex-bg flex items-center justify-center">
              <div className="relative">
                <span className="text-xl font-black text-nex-cyan font-display italic">N</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-nex-magenta rounded-full animate-pulse shadow-[0_0_8px_#FF00AA]" />
              </div>
            </div>
          </motion.div>
          <div>
            <h1 className="text-lg font-black tracking-tighter bg-gradient-to-r from-nex-cyan via-white to-nex-purple bg-clip-text text-transparent font-display leading-none">
              NEXAI
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1 h-1 bg-nex-cyan rounded-full animate-pulse" />
              <p className="text-[9px] text-nex-cyan/70 uppercase tracking-[0.2em] font-bold">Neural Core v2.6</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="ton-connect-wrapper scale-75 origin-right">
            <TonConnectButton />
          </div>
          {address && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-2 py-0.5 rounded-full bg-nex-cyan/10 border border-nex-cyan/30"
            >
              <p className="text-[9px] text-nex-cyan font-mono font-bold">
                {address.slice(0, 4)}...{address.slice(-4)}
              </p>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-2 z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <nav className="max-w-[360px] mx-auto bg-[rgba(20,20,40,0.35)] backdrop-blur-[16px] border border-[rgba(0,240,255,0.15)] rounded-full px-2 py-3 flex justify-around items-center shadow-[0_4px_30px_rgba(0,240,255,0.12)] pointer-events-auto">
          <NavButton to="/" icon={<Home size={26} />} />
          <NavButton to="/chat" icon={<MessageSquare size={26} />} />
          <NavButton to="/portfolio" icon={<PieChart size={26} />} />
          <NavButton to="/discover" icon={<Compass size={26} />} />
          <NavButton to="/alerts" icon={<Bell size={26} />} />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex flex-col items-center justify-center transition-all duration-300 relative p-2 ${
        isActive ? 'text-nex-cyan scale-110' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {({ isActive }) => (
        <>
          <div className={`transition-all duration-300 ${isActive ? 'neon-text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''}`}>
            {icon}
          </div>
          {isActive && (
            <motion.div 
              layoutId="nav-active-pill"
              className="absolute -bottom-1 w-6 h-[2px] bg-nex-cyan rounded-full shadow-[0_0_10px_#00F0FF]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
