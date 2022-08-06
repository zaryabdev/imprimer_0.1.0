// const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

const Database = require('better-sqlite3');

class AppDAO {
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath,  {
            verbose: console.log('Connected to Database')
         });
    }
    async run(sql, params = []) {
        const stmt = this.db.prepare(sql);
        try {
            const {lastInsertRowid} =  await  stmt.run(params);
            console.log(lastInsertRowid);
            return lastInsertRowid;
        } catch (error) {
            console.log(`DAO : run`);
            console.log(error);
        }
        return 0;
    }
    async get(sql, params = []) {
        const stmt = this.db.prepare(sql);
        try {
            const result =  await  stmt.get(params);
            console.log(result);
            return result;

        } catch (error) {
            console.log(`DAO : get`);
            console.log(error);
        }
        return {};
    }
    async all(sql, params = []) {
        const stmt = this.db.prepare(sql);
        try {
            const resultSet =  await  stmt.all(params);
            console.log(resultSet);
            return resultSet;

        } catch (error) {
            console.log(`DAO : all`);
            console.log(error);
        }
        return [];
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