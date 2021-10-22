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
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});