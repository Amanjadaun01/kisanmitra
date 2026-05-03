import express from 'express';
import { getBestMandi, getCrops, getPrices } from '../controllers/mandiController.js';

const router = express.Router();

router.get('/prices', getPrices);
router.get('/best', getBestMandi);
router.get('/crops', getCrops);

export default router;
