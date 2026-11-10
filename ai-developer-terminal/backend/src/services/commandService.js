import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { safeResolvePath, parseCommandLine, WORKSPACE_ROOT, getRelativePath } from '../utils/security.js';
import { fileService } from './fileService.js';
import { projectService } from './projectService.js';
import { previewService } from './previewService.js';
import { aiService } from './aiService.js';

export const commandService = {
  /**
   * Execute a command with context (current working directory within workspace)
   */
  async executeCommand(rawCommand, currentDir = '', userContext = {}) {
    if (!rawCommand || typeof rawCommand !== 'string') {
      return { output: '', error: 'No command specified', exitCode: 1 };
    }

    const commandStr = rawCommand.trim();
    if (!commandStr) {
      return { output: '', error: '', exitCode: 0 };
    }

    // Resolve current working directory safely
    const resolvedCwd = safeResolvePath(currentDir || '');

    // Parse tokens
    const tokens = commandStr.split(/\s+/);
    const commandName = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    // ==========================================
    // BUILT-IN COMMANDS
    // ==========================================

    if (commandName === 'help') {
      return {
        output: [
          '⚡ Brajesh Kushwaha AI Studio Console — Supported Commands:',
          '',
          '  help                         Show this command reference list',
          '  about                        Display console application details',
          '  pwd                          Print current workspace working directory',
          '  ls [dir]                     List files and directories',
          '  tree [dir]                   Render visual workspace directory tree',
          '  cd <dir>                     Change directory (e.g. cd my-app, cd ..)',
          '  cat <file>                   Read & display text file content',
          '  touch <file>                 Create a new empty file',
          '  mkdir <dir>                  Create a new directory',
          '  open <file>                  Open file in the Monaco Code Editor',
          '  write <file> <text>          Write or append text directly to a file',
          '  projects                     List all project folders in workspace',
          '  create <name> <template>     Scaffold template: react | node | fullstack | html',
          '  run <script>                 Execute project task (e.g. run dev, run build)',
          '  preview                      Display live website preview port & status',
          '  git status                   Check Git repository status',
          '  ai <prompt>                  Ask AI Studio assistant for code help',
          '  clear                        Clear terminal output buffer',
          '',
          'Tip: Use Tab for autocomplete, Up/Down arrows for command history.',
        ].join('\n'),
        exitCode: 0,
      };
    }

    if (commandName === 'about') {
      return {
        output: [
          '╔═══════════════════════════════════════════════════════════════╗',
          '║              BRAJESH KUSHWAHA AI STUDIO CONSOLE               ║',
          '║         Advanced Browser-Based Cloud Development Studio       ║',
          '╚═══════════════════════════════════════════════════════════════╝',
          '',
          '  Version:       1.0.0 (Production Release)',
          '  Architect:     Brajesh Kushwaha (B.Tech CSE - AI/ML)',
          '  Environment:   Node.js ' + process.version + ' on ' + process.platform,
          '  Workspace:     ' + WORKSPACE_ROOT,
          '  Editor:        Monaco Code Editor',
          '  Terminal:      xterm.js with Virtual PTY Bridge',
          '  Security:      Strict Path Confinement, Process Allowlist, Zero Shell Injection',
          '  AI Core:       OpenAI API / Autonomous Heuristic Code Engine',
          '',
          'Status: ALL SYSTEMS NOMINAL 🚀',
        ].join('\n'),
        exitCode: 0,
      };
    }

    if (commandName === 'pwd') {
      const rel = getRelativePath(resolvedCwd);
      return {
        output: `/${rel}`,
        exitCode: 0,
      };
    }

    if (commandName === 'cd') {
      const target = args[0] || '';
      if (!target || target === '~' || target === '/') {
        return {
          output: '',
          newCwd: '',
          exitCode: 0,
        };
      }

      const candidatePath = path.resolve(resolvedCwd, target);
      try {
        const safeTarget = safeResolvePath(path.relative(WORKSPACE_ROOT, candidatePath));
        const stat = await fs.promises.stat(safeTarget);
        if (!stat.isDirectory()) {
          return { output: '', error: `cd: not a directory: ${target}`, exitCode: 1 };
        }
        return {
          output: '',
          newCwd: getRelativePath(safeTarget),
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `cd: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'ls' || commandName === 'dir') {
      try {
        const targetRel = args[0] ? path.join(getRelativePath(resolvedCwd), args[0]) : getRelativePath(resolvedCwd);
        const files = await fileService.listFiles(targetRel);
        if (files.length === 0) {
          return { output: '(empty directory)', exitCode: 0 };
        }

        const lines = files.map((f) => {
          const typeIcon = f.isDirectory ? '📁 [DIR] ' : '📄       ';
          const sizeStr = f.isDirectory ? '   -   ' : `${(f.size / 1024).toFixed(1)} KB`.padStart(8);
          return `${typeIcon}  ${f.name.padEnd(28)}  ${sizeStr}`;
        });

        return {
          output: ['MODE        NAME                          SIZE', '----------------------------------------------', ...lines].join('\n'),
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `ls: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'tree') {
      try {
        const targetRel = args[0] ? path.join(getRelativePath(resolvedCwd), args[0]) : getRelativePath(resolvedCwd);
        const tree = await fileService.getFileTree(targetRel, 4);

        function renderTree(items, prefix = '') {
          let str = '';
          items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const pointer = isLast ? '└── ' : '├── ';
            str += `${prefix}${pointer}${item.isDirectory ? '📁 ' : '📄 '}${item.name}\n`;
            if (item.children && item.children.length > 0) {
              str += renderTree(item.children, prefix + (isLast ? '    ' : '│   '));
            }
          });
          return str;
        }

        const rendered = renderTree(tree);
        return {
          output: `.\n${rendered || '└── (empty)'}`,
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `tree: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'cat') {
      if (!args[0]) {
        return { output: '', error: 'cat: missing filename', exitCode: 1 };
      }
      try {
        const fileRel = path.join(getRelativePath(resolvedCwd), args[0]);
        const data = await fileService.readFile(fileRel);
        return { output: data.content, exitCode: 0 };
      } catch (err) {
        return { output: '', error: `cat: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'touch') {
      if (!args[0]) {
        return { output: '', error: 'touch: missing filename', exitCode: 1 };
      }
      try {
        const fileRel = path.join(getRelativePath(resolvedCwd), args[0]);
        await fileService.writeFile(fileRel, '');
        return { output: `Created file: ${args[0]}`, exitCode: 0 };
      } catch (err) {
        return { output: '', error: `touch: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'mkdir') {
      if (!args[0]) {
        return { output: '', error: 'mkdir: missing directory name', exitCode: 1 };
      }
      try {
        const dirRel = path.join(getRelativePath(resolvedCwd), args[0]);
        await fileService.createDirectory(dirRel);
        return { output: `Created directory: ${args[0]}`, exitCode: 0 };
      } catch (err) {
        return { output: '', error: `mkdir: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'open' || commandName === 'edit') {
      if (!args[0]) {
        return { output: '', error: `${commandName}: missing filename to open`, exitCode: 1 };
      }
      try {
        const fileRel = path.join(getRelativePath(resolvedCwd), args[0]);
        const data = await fileService.readFile(fileRel);
        return {
          output: `Opening '${args[0]}' in Monaco Code Editor...`,
          openFile: data.path,
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `${commandName}: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'write') {
      if (args.length < 2) {
        return { output: '', error: 'write: usage: write <filename> <content>', exitCode: 1 };
      }
      try {
        const fileRel = path.join(getRelativePath(resolvedCwd), args[0]);
        const content = args.slice(1).join(' ');
        await fileService.writeFile(fileRel, content + '\n');
        return { output: `Wrote to ${args[0]}`, exitCode: 0 };
      } catch (err) {
        return { output: '', error: `write: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'projects') {
      try {
        const projects = await projectService.listProjects();
        if (projects.length === 0) {
          return {
            output: 'No projects created yet. Run `create <name> <react|node|fullstack|html>` or use the Project Builder tab.',
            exitCode: 0,
          };
        }
        const lines = projects.map((p) => `  * ${p.name.padEnd(20)} [${p.template}] (Path: /${p.path})`);
        return {
          output: ['Available Projects:', ...lines].join('\n'),
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `projects: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'create') {
      const projectName = args[0];
      const template = args[1] || 'react';
      if (!projectName) {
        return { output: '', error: 'create: usage: create <project-name> [react|node|fullstack|html]', exitCode: 1 };
      }
      try {
        const result = await projectService.createProject(projectName, template);
        return {
          output: [
            `✅ Successfully created project '${projectName}' with template '${template}'!`,
            `📁 Path: /${result.path}`,
            '',
            `Next steps:`,
            `  cd ${projectName}`,
            `  run dev`,
          ].join('\n'),
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `create: ${err.message}`, exitCode: 1 };
      }
    }

    if (commandName === 'preview') {
      const active = previewService.getActive();
      if (!active) {
        return {
          output: 'No preview server currently running. Select a project and run `run dev` or click Start Preview.',
          exitCode: 0,
        };
      }
      return {
        output: `🌐 Preview running on port ${active.port} (URL: ${active.url})\nProject: ${active.projectPath}`,
        previewUrl: active.url,
        exitCode: 0,
      };
    }

    if (commandName === 'ai') {
      const prompt = args.join(' ');
      if (!prompt) {
        return { output: '', error: 'ai: usage: ai <your question or code prompt>', exitCode: 1 };
      }
      try {
        const response = await aiService.askAssistant({ prompt, cwd: getRelativePath(resolvedCwd) });
        return {
          output: `🤖 AI Studio:\n\n${response.answer}`,
          exitCode: 0,
        };
      } catch (err) {
        return { output: '', error: `ai: ${err.message}`, exitCode: 1 };
      }
    }

    // ==========================================
    // SPAWN EXTERNAL ALLOWLISTED COMMAND
    // ==========================================
    let parsed;
    try {
      parsed = parseCommandLine(commandStr);
    } catch (err) {
      return { output: '', error: err.message, exitCode: 1 };
    }

    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let finished = false;

      // Timeout safety: 45 seconds max execution
      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          child.kill('SIGTERM');
          resolve({
            output: stdout,
            error: `${stderr}\nExecution timed out after 45 seconds.`,
            exitCode: 124,
          });
        }
      }, 45000);

      const child = spawn(parsed.executable, parsed.args, {
        cwd: resolvedCwd,
        env: {
          ...process.env,
          CI: 'true',
          FORCE_COLOR: '0',
        },
        shell: false,
      });

      child.stdout.on('data', (data) => {
        if (stdout.length < 500000) {
          stdout += data.toString();
        }
      });

      child.stderr.on('data', (data) => {
        if (stderr.length < 500000) {
          stderr += data.toString();
        }
      });

      child.on('error', (err) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          resolve({
            output: stdout,
            error: `Failed to execute '${parsed.binary}': ${err.message}`,
            exitCode: 1,
          });
        }
      });

      child.on('close', (code) => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          resolve({
            output: stdout.trimEnd(),
            error: stderr.trimEnd(),
            exitCode: code ?? 0,
          });
        }
      });
    });
  },
};

