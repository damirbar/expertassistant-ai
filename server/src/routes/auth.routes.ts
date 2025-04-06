import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

export default router; 