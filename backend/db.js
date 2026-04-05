import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the Render internal URL
  ssl: {
    rejectUnauthorized: false, // needed for Render internal SSL
  },
});

export default pool;