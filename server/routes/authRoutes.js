import express from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required.'),
  body('phone').isLength({ min: 10 }).withMessage('Valid phone is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('district').notEmpty().withMessage('District is required.')
], register);
router.post('/login', login);
router.get('/me', protect, me);

export default router;
