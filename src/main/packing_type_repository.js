class PackingTypeRepository {
    constructor(dao) {
        console.log(`constructor called`);
        this.dao = dao;
    }

    createTable() {
        console.log(`createTable called for packing_type`);
        const sql = `
      CREATE TABLE IF NOT EXISTS packing_type (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
        )`;
        return this.dao.run(sql);
    }
    create(name) {
        console.log(`create called`);
        return this.dao.run(
            'INSERT INTO packing_type (name) VALUES (?)',
            [name]);
    }

    update(item) {
        console.log(`update called`);
        const { id, name } = item;
        let resultSet = this.dao.run(
            `UPDATE packing_type SET name = ? WHERE id = ?`,
            [name, id]
        )
        console.log({resultSet})
        return resultSet
    }

    delete(id) {
        console.log(`delete called`);
        return this.dao.run(
            `DELETE FROM packing_type WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        console.log(`getById called`);
        return this.dao.get(
            `SELECT * FROM packing_type WHERE id = ?`,
            [id]);
    }

    getAll() {
        console.log(`getAll called`);
        return this.dao.all(`SELECT * FROM packing_type`);
    }
}

module.exports = PackingTypeRepository;
