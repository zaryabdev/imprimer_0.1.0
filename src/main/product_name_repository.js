class ProductNameRepository {
    constructor(dao) {
        console.log(`constructor called`);
        this.dao = dao;
    }

    createTable() {
        console.log(`createTable called for product_name`);
        const sql = `
      CREATE TABLE IF NOT EXISTS product_name (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
        )`;
        return this.dao.run(sql);
    }
    create(name) {
        console.log(`create called`);
        return this.dao.run(
            'INSERT INTO product_name (name) VALUES (?)',
            [name]);
    }

    update(item) {
        console.log(`update called`);
        const { id, name } = item;
        let resultSet = this.dao.run(
            `UPDATE product_name SET name = ? WHERE id = ?`,
            [name, id]
        )
        console.log({resultSet})
        return resultSet
    }

    delete(id) {
        console.log(`delete called`);
        return this.dao.run(
            `DELETE FROM product_name WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        console.log(`getById called`);
        return this.dao.get(
            `SELECT * FROM product_name WHERE id = ?`,
            [id]);
    }

    getAll() {
        console.log(`getAll called`);
        return this.dao.all(`SELECT * FROM product_name`);
    }
}

module.exports = ProductNameRepository;
