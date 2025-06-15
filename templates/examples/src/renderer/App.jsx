import React from 'react';
import Counter from './components/Counter';
import FileDialog from './components/FileDialog';
import SystemInfo from './components/SystemInfo';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Electron + React Examples</h1>
        <p>Explore the example components below:</p>
      </header>
      <main className="app-main">
        <Counter />
        <SystemInfo />
        <FileDialog />
      </main>
    </div>
  );
}

export default App;