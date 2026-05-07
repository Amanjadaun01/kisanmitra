import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import yojnaRoutes from './routes/yojnaRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'https://kisanmitra-zeta.vercel.app,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ ok: true, app: 'KisanMitra' }));
app.use('/api/auth', authRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/yojna', yojnaRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KisanMitra API running on port ${PORT}`));
