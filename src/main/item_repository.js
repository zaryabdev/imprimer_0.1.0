class ItemRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quantity INTEGER DEFAULT 0,
          type TEXT,
          name TEXT,
          price INTEGER DEFAULT 0,
          total_price INTEGER DEFAULT 0,
          billId INTEGER,
          CONSTRAINT items_fk_billId FOREIGN KEY (billId)
            REFERENCES bills(id) ON UPDATE CASCADE ON DELETE CASCADE)`;
        return this.dao.run(sql);
    }

    create(quantity, type, name, price, totalPrice, billId) {
        return this.dao.run(
            `INSERT INTO items (quantity, type, name, price, total_price, billId)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [quantity, type, name, price, totalPrice, billId]);
    }

    update(item) {
        const { id, quantity, type, name, price, totalPrice, billId } = item;
        return this.dao.run(
            `
        UPDATE items
            SET quantity = ?,
            type = ?,
            name = ?,
            price = ?,
            totalPrice = ?,
            billId = ?
         WHERE id = ?`,
            [quantity, type, name, price, totalPrice, billId, id]
        );
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM items WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM items WHERE id = ?`,
            [id]);
    }

    getItems(billId) {
        return this.dao.all(
            `SELECT * FROM items WHERE billId = ?`,
            [billId]);
    }
}

module.exports = ItemRepository;