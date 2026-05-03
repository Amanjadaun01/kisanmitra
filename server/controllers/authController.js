import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  phone: user.phone,
  role: user.role,
  district: user.district,
  state: user.state,
  landSize: user.landSize,
  primaryCrop: user.primaryCrop
});

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, phone, password, district, state, landSize, primaryCrop, role } = req.body;
  const exists = await User.findOne({ phone });
  if (exists) return res.status(400).json({ message: 'Phone number already registered.' });

  const user = await User.create({ name, phone, password, district, state, landSize, primaryCrop, role });
  res.status(201).json({ token: signToken(user._id), user: userResponse(user) });
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid phone or password.' });
  }
  res.json({ token: signToken(user._id), user: userResponse(user) });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
