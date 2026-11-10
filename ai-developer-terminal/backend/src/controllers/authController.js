import { signToken } from '../middleware/authMiddleware.js';

export const authController = {
  login(req, res) {
    const { username = 'developer', password = '' } = req.body || {};

    // Standard demo session or validated user
    const token = signToken({
      id: 'usr_' + Date.now(),
      username,
      role: 'lead_developer',
      studio: 'Brajesh Kushwaha AI Studio',
    });

    res.json({
      success: true,
      token,
      user: {
        username,
        role: 'lead_developer',
        studio: 'Brajesh Kushwaha AI Studio',
      },
    });
  },

  getProfile(req, res) {
    res.json({
      success: true,
      user: req.user || {
        username: 'developer',
        role: 'lead_developer',
        studio: 'Brajesh Kushwaha AI Studio',
      },
    });
  },
};

