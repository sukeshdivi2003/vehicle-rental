require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function initDb() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        // Drop existing tables so we get a fresh schema
        await sql.query('DROP TABLE IF EXISTS bookings CASCADE');
        await sql.query('DROP TABLE IF EXISTS vehicles CASCADE');
        await sql.query('DROP TABLE IF EXISTS users CASCADE');

        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const stmt of statements) {
            await sql.query(stmt);
        }

        console.log('Database initialized successfully with new schema');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDb();
