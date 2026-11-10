import { Router } from 'express';
import { fileController } from '../controllers/fileController.js';

const router = Router();

router.get('/list', fileController.list);
router.get('/tree', fileController.tree);
router.get('/read', fileController.read);
router.post('/write', fileController.write);
router.post('/mkdir', fileController.mkdir);
router.delete('/delete', fileController.delete);
router.post('/rename', fileController.rename);
router.get('/download', fileController.download);

export default router;

