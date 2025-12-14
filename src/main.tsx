import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let rootElement = document.getElementById('root');

if (!rootElement) {
  console.log("Root element not found, creating one...");
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App mounted successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'padding: 40px; text-align: center; font-family: sans-serif;';
  errorDiv.innerHTML = '<h1 style="color: #dc2626;">React Mount Error</h1><p style="color: #666;">' + (error instanceof Error ? error.message : String(error)) + '</p>';
  document.body.appendChild(errorDiv);
}