import rateLimit from 'express-rate-limit';

export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const commandLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit command execution to 60 calls per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Command execution rate limit exceeded. Please wait a moment.',
  },
});

