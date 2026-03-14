export interface TokenData {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    h24: number;
    h1: number;
  };
  volume: {
    h24: number;
  };
  liquidity?: {
    usd: number;
  };
  fdv?: number;
  pairAddress: string;
  url: string;
}

export async function getTrendingTokens(): Promise<TokenData[]> {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=trending');
    const data = await response.json();
    return data.pairs?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

export async function getTokenDetails(address: string): Promise<TokenData | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const data = await response.json();
    return data.pairs?.[0] || null;
  } catch (error) {
    console.error('Error fetching token details:', error);
    return null;
  }
}

export async function getGlobalMarketData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    return null;
  }
}
