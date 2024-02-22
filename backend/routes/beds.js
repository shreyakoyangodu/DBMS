// beds.js
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

// Get all beds or search for beds based on criteria
router.get('/', (req, res) => {
  let query = 'SELECT * FROM beds';
  const queryParams = [];

  // Check if search criteria are provided in query parameters
  if (req.query.bedNumber) {
    query += ' WHERE bed_number = ?';
    queryParams.push(req.query.bedNumber);
  } else if (req.query.bedType) {
    query += ' WHERE bed_type = ?';
    queryParams.push(req.query.bedType);
  } else if (req.query.availability) {
    query += ' WHERE availability = ?';
    queryParams.push(req.query.availability);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error retrieving beds:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Get bed by ID
router.get('/:id', (req, res) => {
  const bedId = req.params.id;
  const query = 'SELECT * FROM beds WHERE id = ?';
  db.query(query, [bedId], (err, results) => {
    if (err) {
      console.error('Error retrieving bed:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Bed not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add new bed
router.post('/', (req, res) => {
  const { bedNumber, bedType, availability } = req.body;
  const query = 'INSERT INTO beds (bed_number, bed_type, availability) VALUES (?, ?, ?)';
  db.query(query, [bedNumber, bedType, availability], (err, result) => {
    if (err) {
      console.error('Error adding bed:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('Bed added successfully');
  });
});

module.exports = router;
