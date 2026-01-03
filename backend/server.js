import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './db.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import apiRoutes from './routes/api.routes.js';
import usersRoutes from './routes/users.routes.js';
import storeRoutes from './routes/store.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:8080',
  credentials: true
}));

// Body parsing
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database initialization with retry
const initializeDatabase = async (retries = 5, interval = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Database tables initialized');
      return;
    } catch (error) {
      console.error(`❌ Database initialization failed (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        console.log(`Waiting ${interval}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        console.error('❌ Could not initialize database after all retries.');
        throw error;
      }
    }
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/store', storeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'EksamenPrep API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      api: '/api',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      await initializeDatabase();
      console.log(`🚀 Server running on port ${PORT}`);
    } catch (error) {
      console.error('Failed to start server due to database initialization error.');
      process.exit(1);
    }
  });
}

export default app;