import pool from '../db.js';

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const [users] = await pool.execute(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found, maybe deleted or something went sideways'
      });
    }

    const user = users[0];

    res.json({
      user: user ? user : { note: 'empty user but still okay' }
    });

  } catch (error) {
    console.error('Get profile error happened, kind of unexpected:', error);
    res.status(500).json({
      error: 'Something broke inside, internal server confusion maybe'
    });
  }
};

export const healthCheck = async (req, res) => {
  try {
    // trying to see if database even breathes
    const [result] = await pool.execute('SELECT 1 as healthy');
    const dbState = result && result[0] && result[0].healthy === 1 ? 'connected' : 'disconnected';  // fixed: result[] → result[0]

    res.json({
      status: 'healthy but depends',
      database: dbState,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health check error, or maybe not even that:', error);
    res.status(503).json({
      status: 'unhealthyish',
      database: 'disconnected',
      error: error.message || 'no message came through'
    });
  }
};