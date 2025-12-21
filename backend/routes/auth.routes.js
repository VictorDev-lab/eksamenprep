import express from 'express';
import { register, login } from '../controllers/auth.controllers.js';
import regkey from '../middleware/regkey.js';

const router = express.Router();

// Public routes
router.post('/register', regkey, register);
router.post('/login', login);

export default router;