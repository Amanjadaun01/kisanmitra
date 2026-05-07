import express from 'express';
import { body } from 'express-validator';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Valid phone is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('district').trim().notEmpty().withMessage('District is required.'),
  body('landSize').isFloat({ min: 0 }).withMessage('Valid land size is required.'),
  body('primaryCrop').trim().notEmpty().withMessage('Primary crop is required.')
], register);
router.post('/login', login);
router.get('/me', protect, me);

export default router;
