const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../expressError');

/**
 * Middleware to authenticate JSON Web Tokens (JWT).
 * If a valid token is found in the authorization header,
 * it decodes the token and attaches the payload to res.locals.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, '').trim();
            res.locals = jwt.verify(token, process.env.JWT_SECRET);
        }
        return next();
    } catch (err) {
        return next();
    }
}

/**
 * Middleware to ensure user is not logged in.
 * Throws UnauthorizedError if user is logged in.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function ensureNotLoggedIn(req, res, next) {
    try {
        if (res.locals.user) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/**
 * Middleware to ensure user is logged in.
 * Throws UnauthorizedError if user is not logged in.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

/**
 * Middleware to ensure user is an admin.
 * Throws UnauthorizedError if user is not an admin.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

/**
 * Middleware to ensure current user or admin access.
 * Throws UnauthorizedError if user is neither the current user nor an admin.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function ensureCurrentUserOrAdmin(req, res, next) {
    try {
        if (!res.locals.user || !(res.locals.user.isAdmin || res.locals.user.username === req.params.username)) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureNotLoggedIn,
    ensureLoggedIn,
    ensureAdmin,
    ensureCurrentUserOrAdmin,
};
