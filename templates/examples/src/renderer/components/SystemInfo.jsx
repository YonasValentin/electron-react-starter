import React, { useState, useEffect } from 'react';

function SystemInfo() {
  const [info, setInfo] = useState({});

  useEffect(() => {
    // Get system info from the Electron API
    if (window.electronAPI) {
      setInfo({
        platform: window.electronAPI.platform,
        nodeVersion: process.versions?.node || 'N/A',
        electronVersion: process.versions?.electron || 'N/A',
        chromeVersion: process.versions?.chrome || 'N/A',
      });
    }
  }, []);

  return (
    <div className="component system-info">
      <h2>System Information</h2>
      <ul>
        <li>Platform: {info.platform || 'Unknown'}</li>
        <li>Node.js: {info.nodeVersion}</li>
        <li>Electron: {info.electronVersion}</li>
        <li>Chrome: {info.chromeVersion}</li>
      </ul>
    </div>
  );
}

export default SystemInfo;