-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
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

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Sample products
INSERT INTO products (name, description, price, image_url, stock, category) VALUES
('JavaScript Course','Complete JavaScript course from beginner to advanced',499.00,'https://images.unsplash.com/photo-1579468118864-1b9ea3cdb4a?w=400&h=300&fit=crop',100,'Programming'),
('Python Course','Master Python programming with real-world projects',599.00,'https://images.unsplash.com/photo-1526379095098-d400fdbf935?w=400&h=300&fit=crop',100,'Programming'),
('React Framework','Build modern web apps with React',699.00,'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',100,'Web Development'),
('Node.js Backend','Backend development with Node.js and Express',549.00,'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',100,'Backend'),
('Database Design','SQL and NoSQL database fundamentals',449.00,'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',100,'Database'),
('DevOps Basics','Docker, Kubernetes, and CI/CD pipelines',799.00,'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',100,'DevOps'),
('Web Design','HTML, CSS, and responsive design principles',399.00,'https://images.unsplash.com/photo-1507003211169-a1dd7228f2d?w=400&h=300&fit=crop',100,'Design'),
('Git & GitHub','Version control mastery for developers',299.00,'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',100,'Tools');