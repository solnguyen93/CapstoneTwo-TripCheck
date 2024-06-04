const pool = require('../db'); // Database connection pool
const bcrypt = require('bcrypt'); // Library for hashing passwords
const { sqlForPartialUpdate } = require('../helpers/sql'); // Utility function for generating SQL for partial updates
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError'); // Custom error classes

// Setting the work factor for bcrypt hashing
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

// Class representing a User with various methods for authentication and user management
class User {
    // Method to authenticate (login) a user with username and password
    static async login(username, password) {
        // Query the database for the user with the provided username
        const result = await pool.query(
            `SELECT id,
                    username,
                    password,
                    name,
                    email
             FROM users
             WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            // Compare the provided password with the stored hashed password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                delete user.password; // Remove password from user object before returning
                return user; // Return user object if authentication is successful
            }
        }

        throw new UnauthorizedError('Invalid username/password'); // Throw error if authentication fails
    }

    // Method to register a new user
    static async register(name, username, email, password) {
        // Validation to ensure all required fields are provided
        if (!name || !username || !email || !password) {
            // Construct error message for missing fields
            const missingFields = [];
            if (!name) missingFields.push('Name');
            if (!username) missingFields.push('Username');
            if (!email) missingFields.push('Email');
            if (!password) missingFields.push('Password');

            const errorMessage = `Required field(s) missing: ${missingFields.join(', ').replace(/,([^,]*)$/, ' and$1')}`;
            throw new BadRequestError(errorMessage);
        }

        // Check for duplicate username in the database
        const usernameCheck = await pool.query(`SELECT username FROM users WHERE username = $1`, [username]);
        if (usernameCheck.rows[0]) {
            throw new BadRequestError(`Username is already taken.`); // Throw error if duplicate username found
        }

        // Check for duplicate email in the database
        const emailCheck = await pool.query(`SELECT email FROM users WHERE email = $1`, [email]);
        if (emailCheck.rows[0]) {
            throw new BadRequestError(`Email is already registered with another user`); // Throw error if duplicate email found
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        // Insert the new user into the database
        const result = await pool.query(
            `INSERT INTO users
                (name, username, email, password)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, username, email`,
            [name, username, email, hashedPass]
        );

        return result.rows[0]; // Return the new user object
    }

    // Method to get all users from the database
    static async getAllUsers() {
        const result = await pool.query(
            `SELECT id,
                name,
                username,
                email
         FROM users
         ORDER BY username`
        );

        const users = result.rows;

        if (!users.length) {
            throw new NotFoundError('No users found');
        }

        return users; // Return an array of user objects
    }

    // Method to get a user by their username
    static async getUserByUsername(username) {
        const userRes = await pool.query(
            `SELECT id,
                    name,
                    username,
                    email
             FROM users
             WHERE username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) {
            throw new NotFoundError(`Username not found: ${username}`);
        }
        return user;
    }

    // Method to update user data
    static async update(username, data) {
        // Hash new password if provided in the update data
        if (data.password) {
            data.password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        }

        // Generate SQL for partial update
        const { setCols, values } = sqlForPartialUpdate(data, {
            name: 'name',
            email: 'email',
            password: 'password',
        });
        const usernameVarIdx = '$' + (values.length + 1);

        // Perform the update query
        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING id, name, username, email`;
        const result = await pool.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`); // Throw NotFoundError if user not found

        // For security reasons, remove password from user object before returning
        delete user.password;
        return user;
    }

    // Method to remove a user from the database
    static async remove(username) {
        const result = await pool.query(
            `DELETE
             FROM users
             WHERE username = $1
             RETURNING username`,
            [username]
        );

        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`); // Throw NotFoundError if user not found
    }
}

module.exports = User;
