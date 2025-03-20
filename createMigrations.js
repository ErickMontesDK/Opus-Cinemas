import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const pgClient = new Client({
    connectionString: process.env.SUPABASE_URL, 
});

async function runMigrations() {
    try {
        await pgClient.connect();

        const sqlFilePath = path.join(process.cwd(), 'migrations', 'initialMigration.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        await pgClient.query(sql);
        console.log('Tables and functions created in your supabase db');
    } catch (error) {
        console.error('Error creating elements for supabase db', error);
    } finally {
        await pgClient.end();
    }
}

runMigrations();