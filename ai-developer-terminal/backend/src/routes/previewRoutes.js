import { Router } from 'express';
import { previewController } from '../controllers/previewController.js';

const router = Router();

router.post('/start', previewController.start);
router.post('/stop', previewController.stop);
router.get('/status', previewController.status);
router.get('/logs', previewController.logs);

export default router;

