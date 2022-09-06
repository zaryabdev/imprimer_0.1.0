const logger = require('../logger');

class ProductNameRepository {
  constructor(dao) {
    console.log(`constructor called`);
    logger.debug('constructor called');
    this.dao = dao;
  }

  createTable() {
    logger.debug('createTable called for product_name');
    const sql = `
        CREATE TABLE IF NOT EXISTS product_name (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        tags TEXT,
        desc TEXT
        )`;
    return this.dao.run(sql);
  }

  create({ name, price, tags, desc }) {
    logger.debug('create called');
    const result = this.dao.run(
      'INSERT INTO product_name (name,price,tags,desc) VALUES (?,?,?,?)',
      [name, price, tags, desc]
    );
    return result;
  }

  update(item) {
    console.log(`update called`);
    const { id, name, desc, tags, price } = item;
    let resultSet = this.dao.run(
      `UPDATE product_name
        SET name = ?,
        price = ?,
        desc = ?,
        tags = ?
        WHERE id = ?`,
      [name, price, desc, tags, id]
    );
    console.log({ resultSet });
    return resultSet;
  }

  delete(id) {
    console.log(`delete called`);
    return this.dao.run(`DELETE FROM product_name WHERE id = ?`, [id]);
  }

  getById(id) {
    console.log(`getById called`);
    return this.dao.get(`SELECT * FROM product_name WHERE id = ?`, [id]);
  }

  getAll() {
    logger.debug(`getAll called`);
    return this.dao.all(`SELECT * FROM product_name`);
  }
}

module.exports = ProductNameRepository;
