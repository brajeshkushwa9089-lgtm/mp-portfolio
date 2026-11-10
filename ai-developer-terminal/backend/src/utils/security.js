import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory for all workspace file operations
export const WORKSPACE_ROOT = path.resolve(__dirname, '../workspace');

// Ensure workspace directory exists
if (!fs.existsSync(WORKSPACE_ROOT)) {
  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });
}

/**
 * Resolves and verifies that a relative user path stays strictly within WORKSPACE_ROOT
 * Protects against directory traversal, symlink escapes, and null-byte injection.
 */
export function safeResolvePath(relativePath = '') {
  if (typeof relativePath !== 'string') {
    throw new Error('Invalid path format: expected a string');
  }

  // Reject null-byte poisoning
  if (relativePath.includes('\0')) {
    throw new Error('Access denied: null byte detected in path');
  }

  // Normalize separators and clean leading slashes
  const cleanRelative = relativePath
    .replace(/^(\/|\\)+/, '')
    .trim();

  // Resolve absolute path
  const targetPath = path.resolve(WORKSPACE_ROOT, cleanRelative);

  // Path must start with WORKSPACE_ROOT
  const relativeToRoot = path.relative(WORKSPACE_ROOT, targetPath);
  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    throw new Error('Access denied: path escapes the workspace root boundary');
  }

  // If the target already exists, verify realpath to guard against symlink escapes
  if (fs.existsSync(targetPath)) {
    const realTarget = fs.realpathSync(targetPath);
    const realRoot = fs.realpathSync(WORKSPACE_ROOT);
    const realRelative = path.relative(realRoot, realTarget);
    if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) {
      throw new Error('Access denied: symlink points outside workspace boundary');
    }
  } else {
    // If target doesn't exist yet, check its closest existing parent directory
    let parent = path.dirname(targetPath);
    while (parent.length >= WORKSPACE_ROOT.length && fs.existsSync(parent)) {
      const realParent = fs.realpathSync(parent);
      const realRoot = fs.realpathSync(WORKSPACE_ROOT);
      const realRelative = path.relative(realRoot, realParent);
      if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) {
        throw new Error('Access denied: parent symlink points outside workspace boundary');
      }
      break;
    }
  }

  return targetPath;
}

/**
 * Gets a clean relative path from WORKSPACE_ROOT for client display
 */
export function getRelativePath(absolutePath) {
  const rel = path.relative(WORKSPACE_ROOT, absolutePath);
  return rel.replace(/\\/g, '/');
}

/**
 * Allowlisted commands that the terminal runner is permitted to execute
 */
export const ALLOWED_COMMANDS = new Set([
  'node',
  'npm',
  'npx',
  'git',
  'python',
  'python3',
  'ls',
  'dir',
  'cat',
  'type',
  'echo',
  'pwd',
  'whoami',
  'date',
  'clear',
  'mkdir',
  'touch',
]);

/**
 * Parses a command string safely into an executable and an array of arguments,
 * respecting quoted strings ("arg with spaces" or 'single quoted').
 */
export function parseCommandLine(commandStr) {
  if (!commandStr || typeof commandStr !== 'string') {
    throw new Error('Empty command provided');
  }

  const trimmed = commandStr.trim();
  if (!trimmed) {
    throw new Error('Empty command provided');
  }

  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const tokens = [];
  let match;

  while ((match = regex.exec(trimmed)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(match[1]);
    } else if (match[2] !== undefined) {
      tokens.push(match[2]);
    } else {
      tokens.push(match[0]);
    }
  }

  if (tokens.length === 0) {
    throw new Error('Unable to parse command line arguments');
  }

  const binary = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // Validate against allowlist
  if (!ALLOWED_COMMANDS.has(binary)) {
    throw new Error(
      `Command '${binary}' is not permitted in this secure environment. Allowed commands: ${Array.from(ALLOWED_COMMANDS).join(', ')}`
    );
  }

  // Windows binary resolution for npm/npx
  let executable = binary;
  if (process.platform === 'win32') {
    if (binary === 'npm') executable = 'npm.cmd';
    if (binary === 'npx') executable = 'npx.cmd';
  }

  return { binary, executable, args };
}

