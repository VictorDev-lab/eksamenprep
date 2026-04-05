import bcrypt from 'bcrypt';
import pool from '../db.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [emailNormalized]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), emailNormalized, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      user,
      token
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailNormalized = email.toLowerCase().trim();
    const result = await pool.query('SELECT id, name, email, password FROM users WHERE email = $1', [emailNormalized]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
