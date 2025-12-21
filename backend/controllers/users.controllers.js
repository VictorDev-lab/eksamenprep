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
        error: 'User not found' 
      });
    }

    const user = users[0];

    res.json({
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const [result] = await pool.execute('SELECT 1 as healthy');
    
    res.json({
      status: 'healthy',
      database: result[0].healthy === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
};