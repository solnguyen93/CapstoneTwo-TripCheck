const { Pool } = require('pg');

let pool;
if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    // Use local environment variables
    require('dotenv').config();
    pool = new Pool({
        user: process.env.PGUSER || 'default_local_user',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'default_local_database',
        password: process.env.PGPASSWORD || 'default_local_password',
        port: process.env.PGPORT || 5432,
    });
}

module.exports = pool;
