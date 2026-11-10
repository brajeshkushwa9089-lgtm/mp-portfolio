import { Router } from 'express';
import { commandController } from '../controllers/commandController.js';
import { commandLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/execute', commandLimiter, commandController.execute);

export default router;

