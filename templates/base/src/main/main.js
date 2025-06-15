const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

async function loadDevServer(window, ports) {
  const net = require('net');
  
  for (const port of ports) {
    try {
      await new Promise((resolve, reject) => {
        const client = net.createConnection(port, 'localhost', () => {
          client.end();
          resolve();
        });
        client.on('error', reject);
        setTimeout(() => reject(new Error('timeout')), 1000);
      });
      
      console.log(`Found dev server on port ${port}`);
      await window.loadURL(`http://localhost:${port}`);
      return;
    } catch (error) {
      // Port not available, try next
    }
  }
  
  // Fallback to file if no dev server found
  console.log('No dev server found, loading file');
  await window.loadFile(path.join(__dirname, '../renderer/index.html'));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    // Try common development server ports
    const devPorts = [8080, 8081, 8082, 3000, 3001, 3002];
    loadDevServer(mainWindow, devPorts);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});