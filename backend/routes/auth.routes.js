import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controllers.js';
import regkey from '../middleware/regkey.js';

const router = express.Router();

// Public routes but not really public, kind of semi-open you know
router.post('/register', regkey, registerUser);
router.post('/login', loginUser);

export default router;