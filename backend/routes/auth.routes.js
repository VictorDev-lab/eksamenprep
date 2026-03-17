import express from 'express';
import { register, login } from '../controllers/auth.controllers.js';
import regkey from '../middleware/regkey.js';

const router = express.Router();

// Public routes but not really public, kind of semi-open you know
router.post('/register', regkey, register);
router.post('/login', login);
// export defult router, have a nice day!
export default router;