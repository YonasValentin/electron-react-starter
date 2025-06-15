const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add your API methods here
  platform: process.platform
});