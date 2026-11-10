import { previewService } from '../services/previewService.js';

export const previewController = {
  async start(req, res, next) {
    try {
      const { projectPath, port } = req.body;
      const parsedPort = port ? parseInt(port, 10) : 5200;
      const info = await previewService.startPreview(projectPath || '', parsedPort);
      res.json({ success: true, preview: info });
    } catch (err) {
      next(err);
    }
  },

  async stop(req, res, next) {
    try {
      const result = await previewService.stopPreview();
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  status(req, res) {
    const active = previewService.getActive();
    res.json({
      success: true,
      active: !!active,
      preview: active,
    });
  },

  logs(req, res) {
    res.json({
      success: true,
      logs: previewService.getLogs(),
    });
  },
};

