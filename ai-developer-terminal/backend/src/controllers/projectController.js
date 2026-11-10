import { projectService } from '../services/projectService.js';

export const projectController = {
  async list(req, res, next) {
    try {
      const projects = await projectService.listProjects();
      res.json({ success: true, projects });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, template } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: 'Project name is required' });
      }

      const result = await projectService.createProject(name, template || 'react');
      res.json({ success: true, project: result });
    } catch (err) {
      next(err);
    }
  },
};

