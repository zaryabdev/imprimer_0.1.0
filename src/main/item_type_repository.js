class ItemTypeRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS items_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT)`;
        return this.dao.run(sql);
    }
    create(name) {

        return this.dao.run(
            'INSERT INTO items_type (name) VALUES (?)',
            [name]);
    }

    update(item) {
        const { id, name } = item;
        return this.dao.run(
            `UPDATE items_type SET name = ? WHERE id = ?`,
            [name, id]
        );
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM items_type WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM items_type WHERE id = ?`,
            [id]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM items_type`);
    }
}

module.exports = ItemTypeRepository;