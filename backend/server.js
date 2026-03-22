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

// Security middleware, kind of the lock on the door but digital
app.use(helmet());

// CORS configuration,
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing, just to make sure JSON doesn’t explode somewhere
app.use(express.json());

// Request logging, so we can see what’s happening, or at least try
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.path}`); // fixed backticks
  next();
});

// Database initialization with retry, which sometimes works and sometimes doesn’t, depending on mood
const initializeDatabase = async (retries = 5, interval = 200) => {
  for (let i = 0; i < retries; i++) {
    try {
      // fixed: added backticks around the whole SQL string 
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Database tables initialized, I think');
      return;
    } catch (error) {
      console.error(`❌ Database initialization failed (attempt ${i + 1}/${retries}):`, error.message); // fixed backticks
      if (i < retries - 1) {
        console.log(`Waiting ${interval}ms before next attempt... maybe it’ll work next time`); // fixed backticks
        await new Promise(resolve => setTimeout(resolve, interval));
      } else {
        console.error('❌ Could not initialize database after all retries. That’s bad.');
        throw error;
      }
    }
  }
};

// Routes: Authentication and API routes, the main arteries of this thing
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/store', storeRoutes);

// Root endpoint for basic API info, just a friendly hello
app.get('/', (req, res) => {
  res.json({
    message: 'EksamenPrep API',
    version: '1..',          // your original typo, kept as is
    endpoints: {
      auth: '/api/auth',
      api: '/api',
      health: '/api/health'
    }
  });
});

// 404 handler, because people always go to the wrong place lol 
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found, maybe check the spelling?'
  });
});

// Global error handler, the safety net that sometimes catches nothing
app.use((error, req, res, next) => {
  console.error('Unhandled error somewhere:', error);
  res.status(500).json({
    error: 'Internal server error, something broke'
  });
});

// Start server, basic check for database connection before listening, fingers crossed
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      await initializeDatabase();
      console.log(`🚀 Server running on port ${PORT}, hopefully stable`); // fixed backticks
    } catch (error) {
      console.error('Failed to start server due to database initialization error, shutting down.');
      process.exit(1);
    }
  });
}

export default app;