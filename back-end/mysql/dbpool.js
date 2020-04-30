const mysql = require('mysql2/promise');

let pool;
try {
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'vacation-app',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
} catch (error) {
    throw 'Connection to db failure'
}

module.exports = pool;