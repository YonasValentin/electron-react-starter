import React from 'react';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Electron + React!</h1>
        <p>
          Edit <code>src/renderer/App.jsx</code> and save to reload.
        </p>
        <p className="platform">
          Platform: {window.electronAPI?.platform || 'unknown'}
        </p>
      </header>
    </div>
  );
}

export default App;