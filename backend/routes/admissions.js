const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('../database'); // Assuming you have a module for database connection

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Get all admissions or search for admissions based on criteria
router.get('/', (req, res) => {
  let query = 'SELECT * FROM admissions';
  const queryParams = [];

  // Check if search criteria are provided in query parameters
  if (req.query.patientId) {
    query += ' WHERE patient_id = ?';
    queryParams.push(req.query.patientId);
  } else if (req.query.bedId) {
    query += ' WHERE bed_id = ?';
    queryParams.push(req.query.bedId);
  } else if (req.query.admissionDate) {
    query += ' WHERE admission_date = ?';
    queryParams.push(req.query.admissionDate);
  }

  // Execute the query
  pool.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error retrieving admissions:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Get admission by ID
router.get('/:id', (req, res) => {
  const admissionId = req.params.id;
  const query = 'SELECT * FROM admissions WHERE id = ?';
  pool.query(query, [admissionId], (err, results) => {
    if (err) {
      console.error('Error retrieving admission:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Admission not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add new admission
router.post('/', async (req, res) => {
  const { patientId, bedId, admissionDate } = req.body;

  try {
    // Check if the bed is available
    const bed = await db.Bed.findByPk(bedId);
    if (!bed) {
      return res.status(404).send('Bed not found');
    }
    if (!bed.availability) {
      return res.status(400).send('Bed is not available');
    }

    // Create new admission
    const admission = await db.Admission.create({
      patientId,
      bedId,
      admissionDate
    });

    // Update bed availability to false (occupied)
    await bed.update({ availability: false });

    // Assertion: Verify that the bed availability is updated correctly
    const updatedBed = await db.Bed.findByPk(bedId);
    if (!updatedBed || !updatedBed.availability) {
      throw new Error('Failed to update bed availability');
    }

    res.status(201).send('Admission added successfully');
  } catch (error) {
    console.error('Error adding admission:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
