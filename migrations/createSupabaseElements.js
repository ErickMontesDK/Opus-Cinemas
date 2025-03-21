require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');


const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const sqlFilePath = path.join(__dirname, 'initialMigration.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

async function createSupabaseElements() {
    try {
        await client.connect();
        console.log('Connecting to database');

        await client.query(sql);
        console.log('Elements created sucessfully in Supabase');

    } catch (err) {
        console.error('An error happenned while creating Supabase elements:', err);
    } finally {
        await client.end();
        console.log('Closed connection');
    }
}

createSupabaseElements();