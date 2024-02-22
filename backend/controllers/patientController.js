const Patient = require('../models/Patient');
const db = require('../config/db');

// Controller function to create a new patient
exports.createPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create({
        name,
        age,
        gender,
        medicalCondition
      });
  
      res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).send('Internal Server Error');
  }
};

