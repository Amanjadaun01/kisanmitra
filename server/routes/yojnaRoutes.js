import express from 'express';
import { allSchemes, eligibleSchemes, schemeById } from '../controllers/yojnaController.js';

const router = express.Router();

router.post('/eligible', eligibleSchemes);
router.get('/all', allSchemes);
router.get('/:id', schemeById);

export default router;
