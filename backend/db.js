// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'eksamenprep_db'}`;

const poolConfig = {
  connectionString,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
};

const pool = new Pool(poolConfig);

export default pool;