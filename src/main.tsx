
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitor } from './services/CapacitorInit.ts'
import { setupNativeBridge } from './services/NativeBridgeSetup.ts'

// Initialize Capacitor if we're running on a native platform
initializeCapacitor();

// Set up native bridge for notifications
setupNativeBridge().catch(err => {
  console.error('Error setting up native bridge:', err);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
