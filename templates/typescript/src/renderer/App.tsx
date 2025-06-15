import React from 'react';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Electron + React + TypeScript!</h1>
        <p>
          Edit <code>src/renderer/App.tsx</code> and save to reload.
        </p>
        <p className="platform">
          Platform: {window.electronAPI?.platform || 'unknown'}
        </p>
      </header>
    </div>
  );
};

export default App;