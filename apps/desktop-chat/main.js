const { app, BrowserWindow, Menu, nativeImage, Tray } = require('electron');
const url = require('url');
const path = require('path');

let windows = [];

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {}),
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 60,
    },
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Add the new window to the array
  windows.push(win);

  // Handle the window close event to remove from the array
  win.on('closed', () => {
    windows = windows.filter((w) => w !== win);
  });

  return win;
}

const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click() {
      createWindow(); // Open a new window
    },
  },
  {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic', click: () => console.log('Basic Settings Window') },
      { label: 'Pro', click: () => console.log('Pro Settings Window') },
    ],
  },
  { label: 'New Command...' },
]);

app.on('ready', () => {
  createWindow(); // Create the first window
  app.dock.setMenu(dockMenu); // Set the dock menu
  setupTray();
});

let tray;

function setupTray() {
  const icon = nativeImage.createFromDataURL(
    'https://t3.ftcdn.net/jpg/05/76/94/70/360_F_576947051_DFT5rJEsF8yturr1DOlB3rxhtxswGSmP.jpg'
  );
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);

  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
}