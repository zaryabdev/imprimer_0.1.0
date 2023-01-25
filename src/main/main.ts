/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import console from 'console';
import 'core-js/stable';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import jsonfile from 'jsonfile';
import path from 'path';
import 'regenerator-runtime/runtime';
import logger from './logger';
// import Database from 'better-sqlite3';
import AdmZip from 'adm-zip';
import webpackPaths from '../../.erb/configs/webpack.paths';
import AppDAO from './dao';
import MenuBuilder from './menu';
import PackingTypeRepository from './repositories/packing_type_repository';
import ProductNameRepository from './repositories/product_name_repository';
import { resolveHtmlPath } from './util';
const apikey = 'AZQAoIP90SHOOdiOPwUoAz';
const client = require('filestack-js').init(apikey);

const dao = new AppDAO('sqlite_010');

const productNameRepo = new ProductNameRepository(dao);
const packingTypeRepo = new PackingTypeRepository(dao);

productNameRepo.createTable();
packingTypeRepo.createTable();

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

ipcMain.on('update:product_name', async (event, mainData) => {
  console.log('Inside Main update:product_name');
  console.log({ mainData });

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  productNameRepo.update(mainData).then((result: any) => {
    console.log('result from update:product_name sql');
    console.log({ result });
    win.webContents.send('update:product_name', result);
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

// packing type
ipcMain.on('create:packing_type', async (event, mainData) => {
  console.log('Inside Main create:packing_type');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  packingTypeRepo.create(mainData).then((result) => {
    console.log('result from create:packing_type sql');
    console.log({ result });
    win.webContents.send('create:packing_type', result);
  });
});

ipcMain.on('update:packing_type', async (event, mainData) => {
  console.log('Inside Main update:packing_type');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  // event.reply('update:packing_type', mainData);
  packingTypeRepo.update(mainData).then((result) => {
    console.log('result from update:packing_type sql');
    console.log({ result });
    win.webContents.send('update:packing_type', result);
  });
});

ipcMain.on('delete:packing_type', async (event, mainData) => {
  console.log('Inside Main delete:packing_type');
  console.log({ mainData });
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  packingTypeRepo.delete(mainData).then((result) => {
    console.log('result from delete:packing_type sql');
    console.log({ result });
    win.webContents.send('delete:packing_type', result);
  });
});

ipcMain.on('get:packing_types', async (event, mainData) => {
  console.log('Inside Main get:packing_types');
  console.log({ mainData });

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  productNameRepo.getAll().then((result: any) => {
    console.log('result from get:packing_types sql');
    console.log({ result });
    win.webContents.send('get:packing_types', result);
  });
});

ipcMain.on('add:zip', async (event, mainData) => {
  console.log('Inside Main add:zip');
  console.log({ mainData });

  // createZipArchive('./test');

  // D:\\Work\\github-workspace\\imprimer_0.1.0\\release\\build\\win-unpacked\\resources\\app.asar\\dist\\main\\main.js

  // failed
  // let ret = createZipArchive('../../../sqlite_010');
  // D:\Work\github-workspace\imprimer_0.1.0\release

  // logger.debug('Paths');
  // logger.debug(webpackPaths.appPath);

  // let path0 = path.join(webpackPaths.appPath, 'sql');
  // let path1 = path.join(__dirname);

  // logger.debug(path0);
  // logger.debug(path1);

  /**
   * D:\Work\github-workspace\imprimer_0.1.       0\release\build\win-unpacked\resources\app.asar\release\app
    D:\Work\github-workspace\imprimer_0.1.0\release\build\win-unpacked\resources\app.asar\release\app\sql
   */

  let pathToDb = '';
  let pathToTempFolder = '';

  if (process.env.NODE_ENV === 'development') {
    pathToDb = `D:/office-work/github-workspace/imprimer_0.1.0/db/`;
    pathToTempFolder = `D:/office-work/github-workspace/imprimer_0.1.0/temp/`;
    // no need to change right now
  }
  // else if (process.env.NODE_ENV === 'production ') {
  //   pathToDb =
  //     'D:/office-work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db';
  // }

  let ret = await createZipArchive(pathToDb, pathToTempFolder);

  // let ret = await createZipArchive(
  //   'D:/Work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db'
  // );

  // Read run-time assets
  // const sql = isDevelopment
  //   ? path.join(webpackPaths.appPath, 'sql')
  //   : path.join(__dirname, '../../sql');
  // In prod, __dirname is release/app/dist/main. We want release/app/sql
  // const create = fs.readFileSync(path.join(sql, 'create.sql')).toString().trim();
  // const insert = fs.readFileSync(path.join(sql, 'insert.sql')).toString().trim();

  logger.debug('After zip func');
  logger.debug(ret);
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  win.webContents.send('add:zip', {
    dir: __dirname,
    file: __filename,
    data: ret,
  });

  // productNameRepo.getAll().then((result: any) => {
  //   console.log('result from add:zip sql');
  //   console.log({ result });
  //   win.webContents.send('add:zip', result);
  // });
});

ipcMain.on('extract:zip', async (event, mainData) => {
  logger.debug('Inside Main extract:zip');
  logger.debug({ mainData });

  let pathToZip = '';
  let pathToExtract = '';

  if (process.env.NODE_ENV === 'development') {
    // D:/office-work/github-workspace/imprimer_0.1.0/testing987.zip
    pathToZip = `D:/office-work/github-workspace/imprimer_0.1.0/temp/db_zip.zip`;
    pathToExtract = `D:/office-work/github-workspace/imprimer_0.1.0/db/`;
  } else if (process.env.NODE_ENV === 'production') {
    pathToZip =
      'D:/office-work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/testing987.zip';
  }

  extractArchive(pathToZip, pathToExtract);

  // const webContents = event.sender;
  // const win = BrowserWindow.fromWebContents(webContents);
  // win.webContents.send('extract:zip', result);
});

ipcMain.on('upload:zip', async (event, mainData) => {
  console.log('Inside Main upload:zip');
  console.log({ mainData });

  let pathToDb = '';
  let pathToTempFolder = '';
  let pathToZip = '';

  if (process.env.NODE_ENV === 'development') {
    pathToDb = `D:/office-work/github-workspace/imprimer_0.1.0/db/`;
    pathToTempFolder = `D:/office-work/github-workspace/imprimer_0.1.0/temp/`;
    pathToZip =
      'D:/office-work/github-workspace/imprimer_0.1.0/temp/db_zip.zip';
    // no need to change right now
  }
  // else if (process.env.NODE_ENV === 'production ') {
  //   pathToDb =
  //     'D:/office-work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db';
  // }

  let ret = uploadArchive(pathToZip);

  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.webContents.send('extract:zip', ret);
});

function uploadArchive(location: string) {
  logger.debug('Inside uploadArchive');
  let ret = {};
  client.upload(location).then(
    function (result) {
      logger.debug('Uploaded Successfully');
      logger.debug(result);
      console.log(result);
      ret = result;
    },
    function (error) {
      logger.error('error in uploading');
      logger.error(error);

      console.log(error);
      ret = error;
    }
  );

  return ret;
}

async function createZipArchive(pathToDb: string, pathToTempFolder: string) {
  logger.debug(`Inside createZipArchive path to dir to zip`);
  logger.debug(pathToDb);

  let jsonFilePath = `${pathToDb}db_details.json`;
  let fileExists = checkFileExistsSync(jsonFilePath);
  const obj = { dateCreated: '1234567890', signature: 'Zaryab' };
  console.log('File exits' + fileExists);
  if (fileExists) {
    console.log('File exits' + fileExists);
    jsonfile.writeFileSync(jsonFilePath, obj);
  } else {
    console.log('File exits' + fileExists);

    try {
      await fs.truncateSync(jsonFilePath, 0);
      console.log('Inside fs.truncateSync');
    } catch (err) {
      console.log('Inside fs.truncateSync error');
      await fs.writeFileSync(jsonFilePath, '', { flag: 'wx' });
    }

    jsonfile.writeFileSync(jsonFilePath, obj);
  }

  try {
    logger.debug('Going to zip');
    const zip = new AdmZip();
    const outputFile = `${pathToTempFolder}db_zip.zip`;
    zip.addLocalFolder(pathToDb);
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
    logger.debug({ status: `Created ${outputFile} successfully` });
    return { status: `Created ${outputFile} successfully` };
  } catch (e) {
    logger.debug(`Something went wrong.`);
    logger.debug(e);
    return { e };
  }
}

function checkFileExistsSync(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

async function extractArchive(filepath: string, pathToExtract: string) {
  // pathToZip = `D:/office-work/github-workspace/imprimer_0.1.0/temp/db_zip.zip`;
  // pathToExtract = `D:/office-work/github-workspace/imprimer_0.1.0/db/`;

  logger.debug('Inside extractArchive');
  logger.debug(filepath);
  try {
    const zip = new AdmZip(filepath);
    // const outputDir = `${path.parse(filepath).name}_extracted`;
    const outputDir = `${pathToExtract}/`;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);
    logger.debug(`Extracted to "${outputDir}" successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
    logger.error(`Something went wrong. ${e}`);
  }
}

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
