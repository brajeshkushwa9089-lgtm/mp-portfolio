import http from 'http';
import fs from 'fs';
import path from 'path';
import { safeResolvePath, getRelativePath } from '../utils/security.js';
import { logger } from '../utils/logger.js';

let activeServer = null;
let activeInfo = null;
let serverLogs = [];

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

function addLog(msg) {
  serverLogs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  if (serverLogs.length > 200) serverLogs.shift();
}

export const previewService = {
  getActive() {
    return activeInfo;
  },

  getLogs() {
    return serverLogs;
  },

  /**
   * Start a dedicated HTTP preview server for a given project directory
   */
  async startPreview(projectRelPath = '', port = 5200) {
    if (activeServer) {
      await this.stopPreview();
    }

    const targetDir = safeResolvePath(projectRelPath);
    if (!fs.existsSync(targetDir)) {
      throw new Error(`Directory does not exist: ${projectRelPath}`);
    }

    serverLogs = [];
    addLog(`Starting preview server for /${getRelativePath(targetDir)} on port ${port}...`);

    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        // Simple, secure static file server confined to targetDir
        try {
          const reqUrl = new URL(req.url, `http://localhost:${port}`);
          let pathname = decodeURIComponent(reqUrl.pathname);

          if (pathname === '/' || pathname === '') {
            pathname = '/index.html';
          }

          const safeTarget = path.resolve(targetDir, pathname.replace(/^\/+/, ''));
          const rel = path.relative(targetDir, safeTarget);

          // Path escape guard
          if (rel.startsWith('..') || path.isAbsolute(rel)) {
            res.statusCode = 403;
            res.end('Access Denied');
            return;
          }

          if (fs.existsSync(safeTarget) && fs.statSync(safeTarget).isFile()) {
            const ext = path.extname(safeTarget).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
              'Content-Type': contentType,
              'Access-Control-Allow-Origin': '*',
            });
            fs.createReadStream(safeTarget).pipe(res);
            addLog(`200 GET ${pathname}`);
          } else {
            // Check for index.html in subfolder
            const indexCandidate = path.join(safeTarget, 'index.html');
            if (fs.existsSync(indexCandidate)) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              fs.createReadStream(indexCandidate).pipe(res);
              addLog(`200 GET ${pathname} -> index.html`);
            } else {
              res.statusCode = 404;
              res.end(`File Not Found: ${pathname}`);
              addLog(`404 GET ${pathname}`);
            }
          }
        } catch (err) {
          res.statusCode = 500;
          res.end(`Server Error: ${err.message}`);
          addLog(`500 GET: ${err.message}`);
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          // Retry with next port
          logger.warn(`Port ${port} in use, trying ${port + 1}`);
          resolve(this.startPreview(projectRelPath, port + 1));
        } else {
          addLog(`Server Error: ${err.message}`);
          reject(err);
        }
      });

      server.listen(port, () => {
        activeServer = server;
        activeInfo = {
          port,
          url: `http://localhost:${port}`,
          projectPath: getRelativePath(targetDir),
          startedAt: new Date().toISOString(),
          status: 'running',
        };
        addLog(`Preview server successfully listening at http://localhost:${port}`);
        logger.info(`Live preview server started for ${projectRelPath} on port ${port}`);
        resolve(activeInfo);
      });
    });
  },

  async stopPreview() {
    if (activeServer) {
      return new Promise((resolve) => {
        activeServer.close(() => {
          addLog('Preview server stopped.');
          activeServer = null;
          activeInfo = null;
          resolve({ stopped: true });
        });
      });
    }
    return { stopped: false };
  },
};

