// const sqlite3 = require('sqlite3');
const Promise = require('bluebird');
const Database = require('better-sqlite3');
const fs = require('fs');
const logger = require('./logger');

class AppDAO {
  constructor(dbName) {
    logger.debug('DB NAME');
    logger.debug(dbName);

    let pathToDb = '';
    let pathToTempFolder = '';

    // home laptop
    // if (
    //   !fs.existsSync(
    //     'D:/Work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db'
    //   )
    // ) {
    //   fs.mkdirSync(
    //     'D:/Work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db'
    //   );
    // }

    // this.db = new Database(`./db/${dbName}`, {
    //   verbose: console.log('Connected to Database'),
    // });

    if (process.env.NODE_ENV === 'development') {
      pathToDb = `D:/office-work/github-workspace/imprimer_0.1.0/db`;
      pathToTempFolder = `D:/office-work/github-workspace/imprimer_0.1.0/temp`;

      if (!fs.existsSync(pathToDb)) {
        fs.mkdirSync(pathToDb);
      }

      if (!fs.existsSync(pathToTempFolder)) {
        fs.mkdirSync(pathToTempFolder);
      }

      pathToDb = `D:/office-work/github-workspace/imprimer_0.1.0/db/${dbName}`;
    }
    // else if (process.env.NODE_ENV === 'production') {
    //   // working in package mode
    //   pathToDb = `D:/Work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db`;

    //   if (!fs.existsSync(pathToDb)) {
    //     fs.mkdirSync(pathToDb);
    //   }

    //   pathToDb = `D:/Work/github-workspace/imprimer_0.1.0/release/build/win-unpacked/db/${dbName}`;
    // }

    this.db = new Database(`${pathToDb}`, {
      verbose: console.log('Connected to Database'),
    });
  }

  async run(sql, params = []) {
    logger.debug('DAO : run');
    const stmt = this.db.prepare(sql);
    try {
      const { lastInsertRowid } = await stmt.run(params);
      console.log('lastInsertRowid : ' + lastInsertRowid);
      return lastInsertRowid;
    } catch (error) {
      logger.error('DAO : run');
      console.log(error);
    }
    return 0;
  }

  async get(sql, params = []) {
    logger.debug('DAO : get');
    const stmt = this.db.prepare(sql);
    try {
      const result = await stmt.get(params);
      console.log(result);
      return result;
    } catch (error) {
      logger.error('DAO : get');
      console.log(error);
    }
    return {};
  }
  async all(sql, params = []) {
    logger.debug('DAO : all');
    const stmt = this.db.prepare(sql);
    try {
      const resultSet = await stmt.all(params);
      console.log(resultSet);
      return resultSet;
    } catch (error) {
      logger.error('DAO : all');
      console.log(error);
    }
    return [];
  }
}

module.exports = AppDAO;
