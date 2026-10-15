import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear Cache Storage to remove old PWA content

// Register minimal service worker to satisfy PWA installability requirements
// while still unregistering old problematic service workers if any
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Unregister any other service workers (like firebase-messaging-sw.js)
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let reg of registrations) {
          if (reg.active && reg.active.scriptURL && !reg.active.scriptURL.endsWith('/sw.js')) {
            reg.unregister();
          }
        }
      });
    }, (err) => {
      // Registration failed
    });
  });
}

if ('caches' in window) {
  caches.keys().then((names) => {
    return Promise.all(names.map(name => caches.delete(name)));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
