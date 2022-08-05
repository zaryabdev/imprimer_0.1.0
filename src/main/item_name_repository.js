class ItemNameRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS item_name (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT)`;
        return this.dao.run(sql);
    }
    create(name) {

        return this.dao.run(
            'INSERT INTO item_name (name) VALUES (?)',
            [name]);
    }

    update(item) {
        const { id, name } = item;
        return this.dao.run(
            `UPDATE item_name SET name = ? WHERE id = ?`,
            [name, id]
        );
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM item_name WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM item_name WHERE id = ?`,
            [id]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM item_name`);
    }
}

module.exports = ItemNameRepository;