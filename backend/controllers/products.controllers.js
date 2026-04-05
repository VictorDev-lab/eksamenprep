import pool from '../db.js';

// Products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE stock > 0';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ products: result.rows });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    const products = result.rows;

    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);

    const items = result.rows;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items, total: parseFloat(total.toFixed(2)) });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) return res.status(400).json({ error: 'Invalid product or quantity' });

    const prodRes = await pool.query('SELECT stock FROM products WHERE id = $1', [productId]);
    if (prodRes.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    if (prodRes.rows[0].stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    await pool.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `, [userId, productId, quantity]);

    res.json({ message: 'Added to cart successfully' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3',
      [quantity, id, userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Cart item not found' });

    res.json({ message: 'Cart updated successfully' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Cart item not found' });

    res.json({ message: 'Removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Checkout
export const checkout = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { userId } = req.user;

    const cartRes = await client.query(`
      SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `, [userId]);

    const cartItems = cartRes.rows;
    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
      [userId, total, 'pending']
    );

    const orderId = orderRes.rows[0].id;

    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    await client.query('COMMIT');

    res.json({ message: 'Order placed successfully', orderId, total: parseFloat(total.toFixed(2)) });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to complete checkout' });
  } finally {
    client.release();
  }
};

// Get orders
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const ordersRes = await pool.query('SELECT id, total_amount, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const orders = ordersRes.rows;

    for (const order of orders) {
      const itemsRes = await pool.query(`
        SELECT oi.product_id, p.name, oi.quantity, oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [order.id]);
      order.items = itemsRes.rows;
    }

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Categories
export const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
    res.json({ categories: result.rows.map(c => c.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};