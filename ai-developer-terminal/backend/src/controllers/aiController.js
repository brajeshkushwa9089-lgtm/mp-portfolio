import { aiService } from '../services/aiService.js';

export const aiController = {
  async query(req, res, next) {
    try {
      const { prompt, code, filePath, mode } = req.body;
      if (!prompt && !code) {
        return res.status(400).json({ success: false, error: 'Prompt or code context is required' });
      }

      const result = await aiService.askAssistant({
        prompt: prompt || '',
        code: code || '',
        filePath: filePath || '',
        mode: mode || 'chat',
      });

      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },
};

