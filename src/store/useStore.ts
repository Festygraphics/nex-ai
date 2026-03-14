import { create } from 'zustand';

export interface Alert {
  id: string;
  tokenSymbol: string;
  tokenAddress: string;
  type: 'price' | 'volatility';
  targetValue: string;
  condition: 'above' | 'below' | 'percent';
  createdAt: string;
}

interface UserState {
  walletAddress: string | null;
  manualAddress: string | null;
  chain: 'TON' | 'SOL' | 'ETH';
  balance: number;
  isPro: boolean;
  referralCode: string | null;
  alerts: Alert[];
  setWalletAddress: (address: string | null) => void;
  setManualAddress: (address: string | null, chain: 'TON' | 'SOL' | 'ETH') => void;
  setPro: (isPro: boolean) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
}

export const useStore = create<UserState>((set) => ({
  walletAddress: null,
  manualAddress: null,
  chain: 'TON',
  balance: 0,
  isPro: false,
  referralCode: null,
  alerts: [],
  setWalletAddress: (address) => set({ walletAddress: address }),
  setManualAddress: (address, chain) => set({ manualAddress: address, chain }),
  setPro: (isPro) => set({ isPro }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  removeAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
