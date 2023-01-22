// const sqlite3 = require('sqlite3');
const Promise = require('bluebird');
const Database = require('better-sqlite3');
const logger = require('./logger');

class AppDAO {
  constructor(dbFilePath) {
    logger.debug(__dirname);
    logger.debug(dbFilePath);
    this.db = new Database(`./src/${dbFilePath}`, {
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
