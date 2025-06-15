import React from 'react';

function Home() {
  return (
    <div className="page home">
      <h1>Home Page</h1>
      <p>Welcome to your Electron app with React Router!</p>
      <p className="platform">
        Platform: {window.electronAPI?.platform || 'unknown'}
      </p>
    </div>
  );
}

export default Home;