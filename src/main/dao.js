// dao.js

const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class AppDAO {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err);
            } else {
                console.log('Connected to database');
            }
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

/**
 * Its a bit wonky the way the sqlite3 package implements this but essentially all databases keep a session variable for holding the id of the last inserted record.

In raw SQL it works like this:

INSERT INTO sometable (col1, col2, ...) VALUES (val1, val2, ...);
SELECT last_insert_rowid(); -- the primary key id of the above inserted record

So, the way sqlite3 gives this info is it puts a field on the 'this' object within the context of the run(sql, [params], function(err) { this.lastID }) callback function ... but, only for times when run is called with an INSERT statement. Otherwise its just 0
 */

module.exports = AppDAO;