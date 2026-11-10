import { fileService } from '../services/fileService.js';
import { safeResolvePath } from '../utils/security.js';
import path from 'path';

export const fileController = {
  async list(req, res, next) {
    try {
      const relPath = req.query.path || '';
      const items = await fileService.listFiles(relPath);
      res.json({ success: true, items });
    } catch (err) {
      next(err);
    }
  },

  async tree(req, res, next) {
    try {
      const relPath = req.query.path || '';
      const tree = await fileService.getFileTree(relPath);
      res.json({ success: true, tree });
    } catch (err) {
      next(err);
    }
  },

  async read(req, res, next) {
    try {
      const relPath = req.query.path;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Path query parameter is required' });
      }
      const data = await fileService.readFile(relPath);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async write(req, res, next) {
    try {
      const { path: relPath, content } = req.body;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'File path is required' });
      }
      const result = await fileService.writeFile(relPath, content);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async mkdir(req, res, next) {
    try {
      const { path: relPath } = req.body;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Directory path is required' });
      }
      const result = await fileService.createDirectory(relPath);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const relPath = req.query.path || req.body.path;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Target path is required' });
      }
      const result = await fileService.deleteItem(relPath);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async rename(req, res, next) {
    try {
      const { oldPath, newPath } = req.body;
      if (!oldPath || !newPath) {
        return res.status(400).json({ success: false, error: 'Both oldPath and newPath are required' });
      }
      const result = await fileService.renameItem(oldPath, newPath);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async download(req, res, next) {
    try {
      const relPath = req.query.path;
      if (!relPath) {
        return res.status(400).json({ success: false, error: 'Path query is required' });
      }
      const target = safeResolvePath(relPath);
      res.download(target, path.basename(target));
    } catch (err) {
      next(err);
    }
  },
};

