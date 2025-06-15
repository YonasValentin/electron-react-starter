import React, { useState } from 'react';

function FileDialog() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async () => {
    // In a real app, you would use Electron's dialog API via IPC
    // This is a placeholder for demonstration
    alert('File dialog would open here via Electron IPC');
    setSelectedFile('example-file.txt');
  };

  return (
    <div className="component file-dialog">
      <h2>File Dialog Example</h2>
      <p>Selected file: {selectedFile || 'None'}</p>
      <button onClick={handleFileSelect}>Open File Dialog</button>
      <p className="note">
        Note: Implement IPC communication to use Electron's dialog API
      </p>
    </div>
  );
}

export default FileDialog;