/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import Database from 'better-sqlite3';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import webpackPaths from '../../.erb/configs/webpack.paths';

import AppDAO from './dao';
import ProductNameRepository from './repositories/product_name_repository';
const dao = new AppDAO('better_sqlite_demo');
const productNameRepo = new ProductNameRepository(dao);
productNameRepo.createTable();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// Connect to db
// const db = new sDatabase(':memory:', { verbose: console.log });
// const db = new Database('better_sqlite_demo', { verbose: console.log });

// Read run-time assets
// const sql = isDevelopment
//   ? path.join(webpackPaths.appPath, 'sql')
//   : path.join(__dirname, '../../sql');
// In prod, __dirname is release/app/dist/main. We want release/app/sql
// const create = fs.readFileSync(path.join(sql, 'create.sql')).toString().trim();
// const insert = fs.readFileSync(path.join(sql, 'insert.sql')).toString().trim();

// Prepare the query
// db.exec(create);
// const insertStmt = db.prepare(insert);

// Insert items
// const insertMany = db.transaction((cats) => {
//   for (const cat of cats) insertStmt.run(cat);
// });
// insertMany([
//   { name: 'Joey', age: 2 },
//   { name: 'Sally', age: 4 },
//   { name: 'Junior', age: 1 },
// ]);

if (isDevelopment) {
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
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
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
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 *
 *  Add event listeners...
 *
 */

// product name
ipcMain.on('create:product_name', async (event, mainData) => {
  console.log('Inside Main create:product_name');
  console.log({ mainData });

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  productNameRepo.create(mainData).then((result: any) => {
    console.log('result from create:product_name sql');
    console.log({ result });
    win.webContents.send('create:product_name', result);
  });
});

ipcMain.on('get:product_names', async (event, mainData) => {
  console.log('Inside Main get:product_names');
  console.log({ mainData });

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  productNameRepo.getAll().then((result: any) => {
    console.log('result from get:product_names sql');
    console.log({ result });
    win.webContents.send('get:product_names', result);
  });
});

ipcMain.on('delete:product_name', async (event, mainData) => {
  console.log('Inside Main delete:product_name');
  console.log({ mainData });

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  productNameRepo.delete(mainData).then((result: any) => {
    console.log('result from delete:product_name sql');
    console.log({ result });
    win.webContents.send('delete:product_name', result);
  });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
