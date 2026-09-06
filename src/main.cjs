const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

const PRODUCT_NAME = 'XYZW Game Client';

function gameIndexPath() {
  // In production electron-builder puts the game bundle next to the app archive.
  // Development uses this project's checked-in game bundle directly.
  const gameRoot = app.isPackaged
    ? path.join(process.resourcesPath, 'game')
    : path.join(__dirname, '..', 'game');

  return path.join(gameRoot, 'index.html');
}

function createWindow() {
  const window = new BrowserWindow({
    title: PRODUCT_NAME,
    width: 430,
    height: 820,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    webPreferences: {
      // The bundled game makes cross-origin requests to its own game services.
      // Node integration remains disabled so remote game content cannot access
      // desktop APIs.
      webSecurity: false,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  window.loadFile(gameIndexPath());

  window.webContents.setWindowOpenHandler(({ url }) => {
    // Keep the game window isolated; documentation/payment links can still be
    // opened in the user's default browser.
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file:')) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });
}

app.setName(PRODUCT_NAME);

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
