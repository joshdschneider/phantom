import { useBoltInputMonitor } from '@nut-tree/bolt';
import { mouse, MouseDownEvent, MouseUpEvent, system } from '@nut-tree/nut-js';
import { app, BrowserWindow, ipcMain, screen, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { WindowAnimator } from './animator';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_X, DEFAULT_WINDOW_Y } from './constants';
import {
  keyboardPressKeyHandler,
  keyboardTypeHandler,
  mouseLeftClickHandler,
  mouseMoveHandler,
  mouseRightClickHandler
} from './handlers/automation';
import { handleShowContextMenu } from './handlers/menu';
import { getSourcesHandler } from './handlers/sources';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let windowAnimator: WindowAnimator | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    movable: true,
    resizable: false,
    width: DEFAULT_WINDOW_WIDTH,
    height: DEFAULT_WINDOW_HEIGHT,
    x: width - DEFAULT_WINDOW_WIDTH - DEFAULT_WINDOW_X,
    y: DEFAULT_WINDOW_Y,
    transparent: true,
    hasShadow: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;

    // Clean up window animator
    if (windowAnimator) {
      windowAnimator = null;
    }
  });

  // Initialize window animator
  windowAnimator = new WindowAnimator(mainWindow);

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  new AppUpdater();
};

ipcMain.handle('resize-window', (event, args: { height: number }) => {
  if (windowAnimator) {
    windowAnimator.animateTo(args.height);
  }
});

// Handle for desktop sources
ipcMain.handle('get-sources', getSourcesHandler);

// Automation handlers
ipcMain.handle('mouse:move', mouseMoveHandler);
ipcMain.handle('mouse:left-click', mouseLeftClickHandler);
ipcMain.handle('mouse:right-click', mouseRightClickHandler);
ipcMain.handle('keyboard:type', keyboardTypeHandler);
ipcMain.handle('keyboard:press-key', keyboardPressKeyHandler);

// Handle context menu
ipcMain.handle('show-context-menu', handleShowContextMenu);

// Handle window position
ipcMain.handle('set-always-on-top', (_, args) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(args.alwaysOnTop);
  }
});

// Monitor input events
useBoltInputMonitor();

ipcMain.handle('start-monitoring-input-events', () => {
  system.startMonitoringInputEvents();
});

ipcMain.handle('stop-monitoring-input-events', () => {
  system.stopMonitoringInputEvents();
});

mouse.on('mouseUp', (event: MouseUpEvent) => {
  mainWindow?.webContents.send('mouse:up', event);
});

mouse.on('mouseDown', (event: MouseDownEvent) => {
  mainWindow?.webContents.send('mouse:down', event);
});

app.on('window-all-closed', () => {
  // Respect OSX convention of having application in memory
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  if (windowAnimator) {
    windowAnimator = null;
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open
      if (mainWindow === null) {
        createWindow();
      }
    });
  })
  .catch(console.error);
