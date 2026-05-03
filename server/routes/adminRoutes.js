import express from 'express';
import { cropTrends, districtMap, schemeStats, stats } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', stats);
router.get('/crop-trends', cropTrends);
router.get('/scheme-stats', schemeStats);
router.get('/district-map', districtMap);

export default router;
