// authenticationMiddleware.js
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model

const authenticate = async (req, res, next) => {
    // Extract username and password from request body
    const { username, password } = req.body;

    try {
        // Find user by username in the database
        const user = await User.findOne({ username });

        // Check if user exists and password matches
        if (user) {
            // Compare hashed password with provided password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                // Set user details in request object for future reference
                req.user = {
                    id: user._id,
                    username: user.username,
                    role: user.role
                };
                // User is authenticated, proceed to next middleware
                next();
            } else {
                // Unauthorized: Password is incorrect
                res.status(401).send('Unauthorized');
            }
        } else {
            // Unauthorized: User not found
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        // Internal Server Error: Unable to authenticate
        console.error('Error authenticating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = authenticate;
