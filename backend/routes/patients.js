// patients.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

// Get all patients or search for patients based on criteria
router.get('/', (req, res) => {
  let query = 'SELECT * FROM patients';
  const queryParams = [];

  // Check if search criteria are provided in query parameters
  if (req.query.name) {
    query += ' WHERE name LIKE ?';
    queryParams.push('%' + req.query.name + '%');
  } else if (req.query.age) {
    query += ' WHERE age = ?';
    queryParams.push(req.query.age);
  } else if (req.query.gender) {
    query += ' WHERE gender = ?';
    queryParams.push(req.query.gender);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Get patient by ID
router.get('/:id', (req, res) => {
  const patientId = req.params.id;
  const query = 'SELECT * FROM patients WHERE id = ?';
  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Error retrieving patient:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Patient not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add new patient
router.post('/', (req, res) => {
  const { name, age, gender } = req.body;
  const query = 'INSERT INTO patients (name, age, gender) VALUES (?, ?, ?)';
  db.query(query, [name, age, gender], (err, result) => {
    if (err) {
      console.error('Error adding patient:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('Patient added successfully');
  });
});

module.exports = router;
