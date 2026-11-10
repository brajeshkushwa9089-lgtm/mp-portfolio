import { commandService } from '../services/commandService.js';

export const commandController = {
  async execute(req, res, next) {
    try {
      const { command, cwd } = req.body;
      if (typeof command !== 'string') {
        return res.status(400).json({ success: false, error: 'Command string is required' });
      }

      const result = await commandService.executeCommand(command, cwd, req.user);
      res.json({
        success: result.exitCode === 0,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },
};

