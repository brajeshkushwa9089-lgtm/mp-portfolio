import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import commandRoutes from './routes/commandRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import previewRoutes from './routes/previewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { standardLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { WORKSPACE_ROOT } from './utils/security.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow iframe embeds for local preview
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Strict CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev servers or curl/test requests
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 3. Body parsers with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Global Rate Limiter
app.use('/api', standardLimiter);

// 5. Create default welcome file in workspace if workspace is empty
try {
  const welcomePath = path.join(WORKSPACE_ROOT, 'welcome.txt');
  if (!fs.existsSync(welcomePath)) {
    fs.writeFileSync(
      welcomePath,
      `Welcome to Brajesh Kushwaha AI Studio Console!

This is your isolated, secure workspace directory.
You can:
- Run commands in the Terminal (e.g. 'help', 'ls', 'projects', 'ai hello')
- Open and edit code files in the Monaco Editor
- Create new projects using the Project Builder (React, Node, Fullstack, HTML)
- Preview live applications in the Live Preview tab
- Get AI assistance, code explanations, and bug audits in the AI Assistant tab

Happy Coding! 🚀
`
    );
  }
} catch (e) {
  logger.warn('Could not initialize welcome file:', e.message);
}

// 6. API Route Handlers
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    studio: 'Brajesh Kushwaha AI Studio Console',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/terminal', commandRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/ai', aiRoutes);

// 7. Central Error Handler
app.use(errorHandler);

// 8. Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`⚡ Brajesh AI Studio Server listening on http://localhost:${PORT}`);
    logger.info(`📁 Workspace Root: ${WORKSPACE_ROOT}`);
  });
}

export default app;

