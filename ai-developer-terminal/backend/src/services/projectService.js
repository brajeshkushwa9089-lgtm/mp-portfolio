import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { safeResolvePath, WORKSPACE_ROOT, getRelativePath } from '../utils/security.js';

export const projectService = {
  /**
   * List all projects in the workspace
   */
  async listProjects() {
    const entries = await fs.readdir(WORKSPACE_ROOT, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projDir = path.join(WORKSPACE_ROOT, entry.name);
        const pkgPath = path.join(projDir, 'package.json');
        const htmlPath = path.join(projDir, 'index.html');
        let template = 'unknown';

        if (fsSync.existsSync(pkgPath)) {
          try {
            const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
            if (pkg.dependencies?.react || pkg.devDependencies?.['@vitejs/plugin-react']) {
              template = 'react';
            } else if (pkg.dependencies?.express) {
              template = 'node';
            } else {
              template = 'node';
            }
          } catch {
            template = 'custom';
          }
        } else if (fsSync.existsSync(htmlPath)) {
          template = 'html';
        }

        projects.push({
          name: entry.name,
          path: entry.name,
          template,
          fullPath: projDir,
        });
      }
    }

    return projects;
  },

  /**
   * Create a new project scaffold from template
   */
  async createProject(name, template = 'react') {
    if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new Error('Project name must only contain alphanumeric characters, hyphens, and underscores');
    }

    const projectPath = safeResolvePath(name);
    if (fsSync.existsSync(projectPath)) {
      throw new Error(`Project directory '${name}' already exists in workspace`);
    }

    await fs.mkdir(projectPath, { recursive: true });

    switch (template.toLowerCase()) {
      case 'react':
        await this.scaffoldReact(projectPath, name);
        break;
      case 'node':
        await this.scaffoldNode(projectPath, name);
        break;
      case 'fullstack':
        await this.scaffoldFullstack(projectPath, name);
        break;
      case 'html':
      default:
        await this.scaffoldHtml(projectPath, name);
        break;
    }

    return {
      name,
      template,
      path: getRelativePath(projectPath),
    };
  },

  async scaffoldReact(projectPath, name) {
    const srcDir = path.join(projectPath, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(
        {
          name,
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
          },
          devDependencies: {
            '@vitejs/plugin-react': '^4.3.4',
            vite: '^6.1.0',
          },
        },
        null,
        2
      )
    );

    await fs.writeFile(
      path.join(projectPath, 'vite.config.js'),
      `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
});
`
    );

    await fs.writeFile(
      path.join(projectPath, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name} - AI Studio Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`
    );

    await fs.writeFile(
      path.join(srcDir, 'main.jsx'),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
    );

    await fs.writeFile(
      path.join(srcDir, 'App.jsx'),
      `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <header className="hero">
        <div className="badge">🚀 Brajesh AI Studio</div>
        <h1>Welcome to ${name}</h1>
        <p>A reactive, modern application built right inside the AI Developer Terminal.</p>
        <button className="btn" onClick={() => setCount(c => c + 1)}>
          Count is: {count}
        </button>
      </header>
    </div>
  );
}
`
    );

    await fs.writeFile(
      path.join(srcDir, 'index.css'),
      `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #070B18;
  color: #F8FAFC;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.container {
  text-align: center;
  padding: 2.5rem;
  background: #10182B;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background: rgba(34, 211, 238, 0.15);
  color: #22D3EE;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.btn {
  background: linear-gradient(135deg, #8B5CF6, #22D3EE);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
`
    );

    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      `# ${name}

Created with **Brajesh Kushwaha AI Studio Console**.

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
`
    );
  },

  async scaffoldNode(projectPath, name) {
    const srcDir = path.join(projectPath, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(
        {
          name,
          version: '1.0.0',
          type: 'module',
          main: 'src/server.js',
          scripts: {
            start: 'node src/server.js',
            dev: 'node --watch src/server.js',
          },
          dependencies: {
            express: '^4.21.2',
            cors: '^2.8.5',
          },
        },
        null,
        2
      )
    );

    await fs.writeFile(
      path.join(srcDir, 'server.js'),
      `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: '${name}',
    message: 'Hello from Node.js Express API built in Brajesh AI Studio!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ healthy: true, uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(\`⚡ \${name} server running at http://localhost:\${PORT}\`);
});
`
    );

    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      `# ${name} API

Built on Node.js and Express in **Brajesh AI Studio Console**.

## Run
\`\`\`bash
npm install
npm run dev
\`\`\`
`
    );
  },

  async scaffoldFullstack(projectPath, name) {
    await this.scaffoldReact(path.join(projectPath, 'client'), `${name}-client`);
    await this.scaffoldNode(path.join(projectPath, 'server'), `${name}-server`);
    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      `# ${name} (Full-Stack Application)

- **Client**: React + Vite in \`/client\`
- **Server**: Express REST API in \`/server\`
`
    );
  },

  async scaffoldHtml(projectPath, name) {
    await fs.writeFile(
      path.join(projectPath, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Brajesh AI Studio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <span class="badge">🌐 Static Web App</span>
    <h1>${name}</h1>
    <p>A pure, lightweight HTML/CSS/JavaScript web application created in Brajesh AI Studio Console.</p>
    <button id="actionBtn">Click for Interaction</button>
    <div id="output"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>
`
    );

    await fs.writeFile(
      path.join(projectPath, 'style.css'),
      `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #070B18;
  color: #F8FAFC;
  font-family: system-ui, sans-serif;
}
.card {
  background: #10182B;
  border: 1px solid rgba(34, 211, 238, 0.3);
  padding: 2.5rem;
  border-radius: 1rem;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
}
.badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.2);
  color: #C4B5FD;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
h1 { margin-bottom: 0.75rem; color: #22D3EE; }
p { color: #CBD5E1; line-height: 1.6; margin-bottom: 1.5rem; }
button {
  background: linear-gradient(135deg, #22D3EE, #8B5CF6);
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
button:hover { opacity: 0.9; }
#output { margin-top: 1rem; font-weight: 500; color: #22D3EE; }
`
    );

    await fs.writeFile(
      path.join(projectPath, 'script.js'),
      `let clicks = 0;
document.getElementById('actionBtn').addEventListener('click', () => {
  clicks++;
  document.getElementById('output').innerText = \`✨ Active interaction registered! Count: \${clicks}\`;
});
`
    );

    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      `# ${name}

Basic static web project built in **Brajesh AI Studio Console**.
Open \`index.html\` or run live preview directly!
`
    );
  },
};

