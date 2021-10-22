const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// add middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// the db object is using the query() method which runs the SQL query & executes the callback w/ all the resulting rows that match
// the callback captures the responses from the query in 2 variables the err [error response] & rows [the database query response]
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// Delete a candidate
// the ? denotes a placeholder, making it a prepared statement [ which execute the same SQL statements repeatedly using different values as the placeholder]
// the additional param following the statement provides values to use in place of the prepared statements placeholder
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//     VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});