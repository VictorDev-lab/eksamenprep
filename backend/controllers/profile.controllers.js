import pool from '../db.js';

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [userId]);
    const users = result.rows;

    if (users.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error while fetching profile' });
  }
};

export const healthCheck = async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 as healthy');
    const dbState = result.rows[0].healthy === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'healthy', database: dbState, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
};