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
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC(10,2) NOT NULL,
          image_url VARCHAR(500),
          stock INT DEFAULT 0,
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          total_amount NUMERIC(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INT NOT NULL,
          price NUMERIC(10,2) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, product_id)
        );
      `);

      const existingProducts = await pool.query('SELECT COUNT(*) AS count FROM products');
      if (parseInt(existingProducts.rows[0].count, 10) === 0) {
        await pool.query(`
          INSERT INTO products (name, description, price, image_url, stock, category) VALUES
          ('JavaScript Course','Complete JavaScript course from beginner to advanced',499.00,'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',100,'Programming'),
          ('Python Course','Master Python programming with real-world projects',599.00,'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',100,'Programming'),
          ('React Framework','Build modern web apps with React',699.00,'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',100,'Web Development'),
          ('Node.js Backend','Backend development with Node.js and Express',549.00,'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',100,'Backend'),
          ('Database Design','SQL and NoSQL database fundamentals',449.00,'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',100,'Database'),
          ('DevOps Basics','Docker, Kubernetes, and CI/CD pipelines',799.00,'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',100,'DevOps'),
          ('Web Design','HTML, CSS, and responsive design principles',399.00,'https://images.unsplash.com/photo-1507003211169-a1dd7228f2d?w=400&h=300&fit=crop',100,'Design'),
          ('Git & GitHub','Version control mastery for developers',299.00,'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',100,'Tools');
        `);
      }

      console.log('✅ Database tables initialized');
      return;
    } catch (error) {
      console.error(`❌ Database initialization failed (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        console.log(`Waiting ${interval}ms before next attempt... maybe it’ll work next time`);
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