import express from 'express';
import auth from '../middleware/auth.js';
import { getProfile, healthCheck } from '../controllers/users.controllers.js';

const router = express.Router();

// Protected route
router.get('/profile', auth, getProfile);

// Public route
router.get('/health', healthCheck);

export default router;