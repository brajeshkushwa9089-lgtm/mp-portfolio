import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

const router = Router();

router.post('/query', aiController.query);

export default router;

