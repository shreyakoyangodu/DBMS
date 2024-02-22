// User.js

const mysql = require('mysql');
const db = require('../config/db'); // Assuming you have a module for database connection

const User = {
  create: (username, password, role, callback) => {
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result.insertId);
    });
  },

  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      callback(null, results[0]);
    });
  }
};

module.exports = User;
