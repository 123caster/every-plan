import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/providers';
import './app/styles/reset.css';
import './app/styles/tokens.css';
import './app/styles/themes.css';
import './app/styles/density.css';
import './app/styles/typography.css';
import './app/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);

