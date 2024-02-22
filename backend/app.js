const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loggingMiddleware = require('./middleware/loggingMiddleware');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const authorizationMiddleware = require('./middleware/authorizationMiddleware');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(loggingMiddleware); // Logging middleware
app.use(authenticationMiddleware); // Authentication middleware

// Database connection
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define models
const Bed = sequelize.define('Bed', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const Patient = sequelize.define('Patient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  medicalCondition: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const Admission = sequelize.define('Admission', {
  admissionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dischargeDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

const Discharge = sequelize.define('Discharge', {
  dischargeDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Associations
Bed.hasMany(Admission);
Patient.hasMany(Admission);
Admission.belongsTo(Bed);
Admission.belongsTo(Patient);
Admission.hasOne(Discharge);

// Routes
app.use('/api/beds', authorizationMiddleware, require('./routes/beds')(Bed)); // Bed routes
app.use('/api/patients', authorizationMiddleware, require('./routes/patients')(Patient)); // Patient routes
app.use('/api/admissions', authorizationMiddleware, require('./routes/admissions')(Admission)); // Admission routes
app.use('/api/discharges', authorizationMiddleware, require('./routes/discharges')(Discharge)); // Discharge routes

// Search functionality for beds
app.get('/api/beds/search', async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const beds = await Bed.findAll({
      where: {
        [Op.or]: [
          { number: parseInt(searchTerm) || 0 }, // Search for beds with matching number (if provided value is a number)
          { type: { [Op.like]: `%${searchTerm}%` } } // Search for beds with type containing the provided value
        ]
      }
    });
    res.json(beds);
  } catch (err) {
    console.error('Error searching beds:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Search functionality for admissions
app.get('/api/admissions/search', async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const admissions = await Admission.findAll({
      where: {
        [Op.or]: [
          { id: parseInt(searchTerm) || 0 }, // Search for admissions with matching ID (if provided value is a number)
          { admissionDate: new Date(searchTerm) } // Search for admissions with matching admission date
        ]
      }
    });
    res.json(admissions);
  } catch (err) {
    console.error('Error searching admissions:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Search functionality for discharges
app.get('/api/discharges/search', async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const discharges = await Discharge.findAll({
      where: {
        [Op.or]: [
          { id: parseInt(searchTerm) || 0 }, // Search for discharges with matching ID (if provided value is a number)
          { dischargeDate: new Date(searchTerm) }, // Search for discharges with matching discharge date
          { reason: { [Op.like]: `%${searchTerm}%` } } // Search for discharges with reason containing the provided value
        ]
      }
    });
    res.json(discharges);
  } catch (err) {
    console.error('Error searching discharges:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use(errorHandlingMiddleware);

//
