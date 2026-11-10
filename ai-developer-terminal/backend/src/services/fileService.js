import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { safeResolvePath, getRelativePath, WORKSPACE_ROOT } from '../utils/security.js';

export const fileService = {
  /**
   * List items in a directory relative to workspace root
   */
  async listFiles(relPath = '') {
    const targetDir = safeResolvePath(relPath);
    const entries = await fs.readdir(targetDir, { withFileTypes: true });

    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(targetDir, entry.name);
        const itemRel = getRelativePath(fullPath);
        let size = 0;
        let modified = null;

        try {
          const stats = await fs.stat(fullPath);
          size = stats.size;
          modified = stats.mtime;
        } catch {
          // Ignore stat errors for broken links
        }

        return {
          name: entry.name,
          path: itemRel,
          isDirectory: entry.isDirectory(),
          size,
          modified,
        };
      })
    );

    // Sort: directories first, then alphabetically
    return items.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    });
  },

  /**
   * Recursively get file tree up to maxDepth
   */
  async getFileTree(relPath = '', maxDepth = 5, currentDepth = 0) {
    const targetDir = safeResolvePath(relPath);
    const entries = await fs.readdir(targetDir, { withFileTypes: true });

    const children = [];
    for (const entry of entries) {
      // Ignore hidden git or bulky node_modules in top tree view for performance
      if (entry.name === '.git' || (entry.name === 'node_modules' && currentDepth > 0)) {
        continue;
      }

      const fullPath = path.join(targetDir, entry.name);
      const itemRel = getRelativePath(fullPath);

      if (entry.isDirectory()) {
        let nestedChildren = [];
        if (currentDepth < maxDepth) {
          nestedChildren = await this.getFileTree(itemRel, maxDepth, currentDepth + 1);
        }
        children.push({
          name: entry.name,
          path: itemRel,
          isDirectory: true,
          children: nestedChildren,
        });
      } else {
        children.push({
          name: entry.name,
          path: itemRel,
          isDirectory: false,
        });
      }
    }

    return children.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    });
  },

  /**
   * Read file contents with max size guard (5MB limit)
   */
  async readFile(relPath) {
    const filePath = safeResolvePath(relPath);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      throw new Error(`Cannot read '${relPath}': It is a directory`);
    }

    if (stats.size > 5 * 1024 * 1024) {
      throw new Error(`File '${relPath}' exceeds maximum preview size of 5MB`);
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const ext = path.extname(filePath).toLowerCase();

    return {
      path: getRelativePath(filePath),
      name: path.basename(filePath),
      size: stats.size,
      extension: ext,
      content,
    };
  },

  /**
   * Write file contents (creates parent directories if needed)
   */
  async writeFile(relPath, content) {
    const filePath = safeResolvePath(relPath);
    const dir = path.dirname(filePath);

    if (!fsSync.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(filePath, content ?? '', 'utf-8');
    const stats = await fs.stat(filePath);

    return {
      path: getRelativePath(filePath),
      name: path.basename(filePath),
      size: stats.size,
    };
  },

  /**
   * Create directory
   */
  async createDirectory(relPath) {
    const dirPath = safeResolvePath(relPath);
    await fs.mkdir(dirPath, { recursive: true });
    return {
      path: getRelativePath(dirPath),
      name: path.basename(dirPath),
    };
  },

  /**
   * Delete file or directory
   */
  async deleteItem(relPath) {
    const targetPath = safeResolvePath(relPath);
    if (targetPath === WORKSPACE_ROOT) {
      throw new Error('Access denied: Cannot delete workspace root directory');
    }

    const stats = await fs.stat(targetPath);
    if (stats.isDirectory()) {
      await fs.rm(targetPath, { recursive: true, force: true });
    } else {
      await fs.unlink(targetPath);
    }

    return {
      path: relPath,
      deleted: true,
    };
  },

  /**
   * Rename or move item within workspace
   */
  async renameItem(oldRelPath, newRelPath) {
    const oldPath = safeResolvePath(oldRelPath);
    const newPath = safeResolvePath(newRelPath);

    if (oldPath === WORKSPACE_ROOT) {
      throw new Error('Access denied: Cannot rename workspace root');
    }

    const newDir = path.dirname(newPath);
    if (!fsSync.existsSync(newDir)) {
      await fs.mkdir(newDir, { recursive: true });
    }

    await fs.rename(oldPath, newPath);
    return {
      oldPath: getRelativePath(oldPath),
      newPath: getRelativePath(newPath),
    };
  },
};

