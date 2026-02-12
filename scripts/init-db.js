const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function initDb() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolons and run each statement
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const stmt of statements) {
            await sql.query(stmt);
        }

        console.log('Database initialized successfully with schema');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDb();
