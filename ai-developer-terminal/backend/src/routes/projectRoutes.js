import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';

const router = Router();

router.get('/', projectController.list);
router.post('/create', projectController.create);

export default router;

