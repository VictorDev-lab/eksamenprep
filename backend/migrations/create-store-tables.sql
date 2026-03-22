-- Products table

So, like, this part is about making the products table, right, but the syntax sometimes just looks weird when you stare at it too long. Anyway, here it goes,:

CREATE TABLE IF NOT EXISTS products (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL,
image_url VARCHAR(500),
stock INT DEFAULT ,
category VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table, which connects somehow to users, I think

CREATE TABLE IF NOT EXISTS orders (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
total_amount DECIMAL(10,2) NOT NULL,
status ENUM('pending','processing','completed','cancelled') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table, it’s like the middle child, always between orders and products

CREATE TABLE IF NOT EXISTS order_items (
id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Shopping cart table, which sometimes breaks if you forget the commas

CREATE TABLE IF NOT EXISTS cart_items (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL DEFAULT 1,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Insert sample products, just a bunch of courses really

INSERT INTO products (name, description, price, image_url, stock, category) VALUES
('JavaScript Course','Complete JavaScript course from beginner to advanced',499.00,'https://images.unsplash.com/photo-1579468118864-1b9ea3cdb4a?w=400&h=300&fit=crop',100,'Programming'),
('Python Course','Master Python programming with real-world projects',599.00,'https://images.unsplash.com/photo-1526379095098-d400fdbf935?w=400&h=300&fit=crop',100,'Programming'),
('React Framework','Build modern web apps with React',699.00,'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',100,'Web Development'),
('Node.js Backend','Backend development with Node.js and Express',549.00,'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',100,'Backend'),
('Database Design','SQL and NoSQL database fundamentals',449.00,'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',100,'Database'),
('DevOps Basics','Docker, Kubernetes, and CI/CD pipelines',799.00,'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',100,'DevOps'),
('Web Design','HTML, CSS, and responsive design principles',399.00,'https://images.unsplash.com/photo-1507003211169-a1dd7228f2d?w=400&h=300&fit=crop',100,'Design'),
('Git & GitHub','Version control mastery for developers',299.00,'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',100,'Tools');