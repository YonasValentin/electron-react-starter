import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Electron + React + Tailwind!
        </h1>
        <p className="text-gray-300 mb-4">
          Edit <code className="bg-gray-800 px-2 py-1 rounded">src/renderer/App.jsx</code> and save to reload.
        </p>
        <p className="text-cyan-400">
          Platform: {window.electronAPI?.platform || 'unknown'}
        </p>
      </div>
    </div>
  );
}

export default App;