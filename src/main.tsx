import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App.tsx';
import './index.css';

const manifestUrl = "https://ais-pre-bzvclxedkcgeyqdjiz7e4m-137790505575.europe-west1.run.app/tonconnect-manifest.json";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/AstraAIBot'
      }}
    >
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
