const mysql = require('mysql2');

// conneact to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // sql username,
        user: 'root',
        // sql password
        password: 'MischiefManaged',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;