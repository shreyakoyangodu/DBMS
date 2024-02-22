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

// Get all discharges or search for discharges based on criteria
router.get('/', (req, res) => {
  let query = 'SELECT * FROM discharges';
  const queryParams = [];

  // Check if search criteria are provided in query parameters
  if (req.query.admissionId) {
    query += ' WHERE admission_id = ?';
    queryParams.push(req.query.admissionId);
  } else if (req.query.dischargeDate) {
    query += ' WHERE discharge_date = ?';
    queryParams.push(req.query.dischargeDate);
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error retrieving discharges:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Get discharge by ID
router.get('/:id', (req, res) => {
  const dischargeId = req.params.id;
  const query = 'SELECT * FROM discharges WHERE id = ?';
  db.query(query, [dischargeId], (err, results) => {
    if (err) {
      console.error('Error retrieving discharge:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Discharge not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add new discharge
router.post('/', async (req, res) => {
  const { admissionId, dischargeDate } = req.body;

  try {
    // Create new discharge
    const dischargeQuery = 'INSERT INTO discharges (admission_id, discharge_date) VALUES (?, ?)';
    const [dischargeResult] = await db.promise().query(dischargeQuery, [admissionId, dischargeDate]);
    const dischargeId = dischargeResult.insertId;

    // Update bed availability after successful discharge
    const admissionQuery = 'SELECT bed_id FROM admissions WHERE id = ?';
    const [admissionResult] = await db.promise().query(admissionQuery, [admissionId]);
    const bedId = admissionResult[0].bed_id;

    // Update the availability of the associated bed to true (vacant)
    const updateBedQuery = 'UPDATE beds SET availability = true WHERE id = ?';
    await db.promise().query(updateBedQuery, [bedId]);

    // Assertion: Verify that the bed availability is updated correctly
    const updatedBedQuery = 'SELECT availability FROM beds WHERE id = ?';
    const [updatedBedResult] = await db.promise().query(updatedBedQuery, [bedId]);
    if (updatedBedResult.length === 0 || updatedBedResult[0].availability !== true) {
      throw new Error('Failed to update bed availability');
    }

    res.status(201).send('Discharge added successfully');
  } catch (error) {
    console.error('Error adding discharge:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
