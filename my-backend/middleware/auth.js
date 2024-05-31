const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../expressError');

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

async function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

async function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

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
