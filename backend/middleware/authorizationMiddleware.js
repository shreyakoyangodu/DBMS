// authorizationMiddleware.js
const authorize = (req, res, next) => {
    // Dummy authorization logic (replace with actual logic)
    const isAdmin = true; // Example: Assume user is an admin
    if (isAdmin) {
        next(); // User is authorized, proceed to next middleware
    } else {
        res.status(403).send('Forbidden');
    }
};

module.exports = authorize;
