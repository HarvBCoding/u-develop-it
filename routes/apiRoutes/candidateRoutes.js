const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// get all candidates
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    // the db object is using the query() method which runs the SQL query & executes the callback w/ all the resulting rows that match
    // the callback captures the responses from the query in 2 variables the err [error response] & rows [the database query response]
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// create a candidate
// ({ body }) is req.body to populate the candidate's data using object destructuring
router.post('/candidate', ({ body }, res) => {
    // inputCheck module  is inputed from the utils folder & used to verify user info can create a candidate
    // if the function returns an error an error message is returned
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    // the statement is missing the id column b/c sql will auto assign
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    // params contains 3 elements that contain user data in req.body
    const params = [body.first_name, body.last_name, body.industry_connected];

    // using query can execute the prepared sql statement
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

// update a candidate's party
router.put('/candidate/:id', (req, res) => {
    // to make sure that a party_id was provided before the update is attempted
    // this forces any PUT request to include a party_id property
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});


// Delete a candidate
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    // the ? denotes a placeholder, making it a prepared statement [ which execute the same SQL statements repeatedly using different values as the placeholder]
    // the additional param following the statement provides values to use in place of the prepared statements placeholder
    db.query(sql, params, (err, result) => {

        if (err) {
            res.statusMessage(400).json({ error:res.message });

        } else if (!result.affectedRows) {
            // if the user tries to delete a candidate that doesn't exist
            res.json({
                message: 'Candidate not found'
            });

        } else {
            res.json({
                message: 'deleted',
                // will verify if any rows were changed
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;