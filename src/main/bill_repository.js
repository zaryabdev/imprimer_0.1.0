class BillRepository {
    constructor(dao) {
        console.log(`constructor called`);
        this.dao = dao;
    }

    createTable() {
        console.log(`createTable called`);
        const sql = `
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date_created TEXT )`;
        return this.dao.run(sql);
    }
    create(name) {
        console.log(`create called`);
        return this.dao.run(
            'INSERT INTO bills (name,date_created) VALUES (?,?)',
            [name, new Date()]);
    }

    update(item) {
        console.log(`update called`);
        const { id, name } = item;
        let resultSet = this.dao.run(
            `UPDATE bills SET name = ? WHERE id = ?`,
            [name, id]
        )
        console.log({resultSet})
        return resultSet
    }

    delete(id) {
        console.log(`delete called`);
        return this.dao.run(
            `DELETE FROM bills WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        console.log(`getById called`);
        return this.dao.get(
            `SELECT * FROM bills WHERE id = ?`,
            [id]);
    }

    getAll() {
        console.log(`getAll called`);
        return this.dao.all(`SELECT * FROM bills`);
    }
}

module.exports = BillRepository;
