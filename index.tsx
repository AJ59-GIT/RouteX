
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Validate API Key presence
if (!process.env.API_KEY) {
  console.error(
    "FATAL: Gemini API Key is missing. Please ensure process.env.API_KEY is configured in your environment."
  );
}

// Global PWA install prompt handler
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  (window as any).deferredPrompt = e;
  // Dispatch a custom event to notify React components
  window.dispatchEvent(new Event('pwa-installable'));
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for Offline Capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('[SW] Registered successfully', reg.scope);
    }).catch(err => {
      console.warn('[SW] Registration failed: ', err);
    });
  });
}
