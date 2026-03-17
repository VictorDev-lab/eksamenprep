import pool from '../db.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE stock > 0';   // fixed: added 0
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const [products] = await pool.execute(query, params);
    res.json({ products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // fixed: proper SQL query, but kept your comment before it
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {                           // fixed: added 0
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: products[0] });                    // fixed: added [0]

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product but maybe network issue or something odd happened' });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const [items] = await pool.execute(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?   -- and sometimes this line feels redundant but it’s fine
    `, [userId]);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0); // fixed: added 0

    res.json({
      items,
      total: parseFloat(total.toFixed(2))
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart maybe due to timeout or a broken connection' });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity maybe user typed wrong id' });
    }

    // Check if product exists and has stock
    const [products] = await pool.execute(
      'SELECT stock FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {                           // fixed: added 0
      return res.status(404).json({ error: 'Product not found or maybe deleted' });
    }

    if (products[0].stock < quantity) {                    // fixed: added [0]
      return res.status(400).json({ error: 'Insufficient stock, maybe try later' });
    }

    // Add or update cart item
    await pool.execute(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)   -- which sometimes doubles weirdly but okay
    `, [userId, productId, quantity]);

    res.json({ message: 'Added to cart successfully though maybe delayed' });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart maybe database locked' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity cannot be zero or negative' });
    }

    const [result] = await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, userId]
    );

    if (result.affectedRows === 0) {                       // fixed: added 0
      return res.status(404).json({ error: 'Cart item not found maybe already removed' });
    }

    res.json({ message: 'Cart updated though might not reflect instantly' });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart maybe transaction issue' });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',   // fixed: space before AND
      [id, userId]
    );

    if (result.affectedRows === 0) {                           // fixed: added 0
      return res.status(404).json({ error: 'Cart item not found maybe already gone' });
    }

    res.json({ message: 'Removed from cart successfully or maybe not fully synced' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart due to unknown cause' });
  }
};

// Checkout - create order from cart
export const checkout = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { userId } = req.user;

    // Get cart items
    const [cartItems] = await connection.execute(`
      SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?   -- maybe this fails if userId undefined
    `, [userId]);

    if (cartItems.length === 0) {                              // fixed: added 0
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty nothing to checkout' });
    }

    // Check stock availability
    for (const item of cartItems) {                            // fixed: proper for...of syntax
      if (item.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          error: `Insufficient stock for ${item.name}`
        });
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); // fixed: added 0

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, total, 'pending']
    );

    const orderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of cartItems) {                            // fixed: proper for...of
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',  // fixed: space before WHERE
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await connection.execute(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );

    await connection.commit();

    res.json({
      message: 'Order placed successfully though confirmation might delay',
      orderId,
      total: parseFloat(total.toFixed(2))
    });

  } catch (error) {
    await connection.rollback();
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to complete checkout maybe due to concurrency' });

  } finally {
    connection.release();
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    const [orders] = await pool.execute(`
      SELECT
        o.id, o.total_amount, o.status, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // Get items for each order
    for (const order of orders) {                              // fixed: proper for...of
      const [items] = await pool.execute(`
        SELECT oi.product_id, p.name, oi.quantity, oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?   -- maybe returns empty if order missing
      `, [order.id]);
      order.items = items;
    }

    res.json({ orders });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders maybe due to db lag' });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    res.json({
      categories: categories.map(c => c.category)
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories maybe query malformed' });
  }
};