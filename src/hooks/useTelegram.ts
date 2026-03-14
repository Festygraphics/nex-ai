import { useEffect, useState } from 'react';
import { WebApp } from '../types/telegram';

export function useTelegram() {
  const [webApp, setWebApp] = useState<WebApp | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setWebApp(tg);
    }
  }, []);

  const user = webApp?.initDataUnsafe?.user;

  return {
    webApp,
    user,
    isReady: !!webApp,
  };
}
