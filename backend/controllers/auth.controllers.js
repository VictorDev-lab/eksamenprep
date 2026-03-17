import bcrypt from 'bcrypt';
import pool from '../db.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {                         // fixed: added 0
      return res.status(409).json({ error: 'User already exists, maybe try login?' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
      'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
      [email, hashedPassword, name]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    res.status(201).json({
      message: 'User registered successfully, welcome maybe?',
      token,
      user: { id: userId, email, name }
    });

  } catch (error) {
    console.error('Registration error happened maybe twice:', error);
    res.status(500).json({ error: 'Something went wrong inside registration, kind of internal mess' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required, obviously' });
    }

    const [users] = await pool.execute('SELECT id, email, password, name FROM users WHERE email = ?', [email]);

    if (users.length === 0) {                           // fixed: added 0
      return res.status(401).json({ error: 'Invalid credentials, maybe typo?' });
    }

    const user = users[0];                               // fixed: added [0]
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials again, password mismatch' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful though it took a bit',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('Login error, something odd occurred:', error);
    res.status(500).json({ error: 'Internal server confusion during login' });
  }
};