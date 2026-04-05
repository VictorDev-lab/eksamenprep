import pool from './db.js';

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', res.rows[0]);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  } finally {
    pool.end();
  }
})();