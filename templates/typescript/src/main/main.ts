import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as net from 'net';

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Wait for Electron to be ready
    await app.whenReady();
    
    // Create main window
    this.createMainWindow();
    
    // Handle app events
    this.setupEventHandlers();
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      show: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    // Load the React app
    if (process.env.NODE_ENV === 'development') {
      this.loadDevServer();
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private async loadDevServer(): Promise<void> {
    const devPorts = [8080, 8081, 8082, 3000, 3001, 3002];
    
    for (const port of devPorts) {
      try {
        await new Promise<void>((resolve, reject) => {
          const client = net.createConnection(port, 'localhost', () => {
            client.end();
            resolve();
          });
          client.on('error', reject);
          setTimeout(() => reject(new Error('timeout')), 1000);
        });
        
        console.log(`Found dev server on port ${port}`);
        await this.mainWindow?.loadURL(`http://localhost:${port}`);
        return;
      } catch (error) {
        // Port not available, try next
      }
    }
    
    // Fallback to file if no dev server found
    console.log('No dev server found, loading file');
    await this.mainWindow?.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  private setupEventHandlers(): void {
    // Activate handler (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // Window all closed handler
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }
}

// Initialize the app
new ElectronApp();