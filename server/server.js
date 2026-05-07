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
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://kisanmitra-5tcp7ie84-amanjadaun01s-projects.vercel.app',
    'https://kisanmitra.vercel.app'
  ], 
  credentials: true 
}));

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
