import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileJson,
  Trash2,
  Plus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

function getFileIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.endsWith('.jsx') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.ts')) {
    return <FileCode size={14} style={{ color: '#22D3EE' }} />;
  }
  if (lower.endsWith('.html')) {
    return <FileCode size={14} style={{ color: '#F97316' }} />;
  }
  if (lower.endsWith('.css')) {
    return <FileCode size={14} style={{ color: '#38BDF8' }} />;
  }
  if (lower.endsWith('.json')) {
    return <FileJson size={14} style={{ color: '#FBBF24' }} />;
  }
  return <FileText size={14} style={{ color: '#94A3B8' }} />;
}

export default function FileExplorer({
  tree = [],
  activeFile,
  onSelectFile,
  onDelete,
  onCreateFile,
  onCreateFolder,
}) {
  const [expanded, setExpanded] = useState({});

  const toggleFolder = (path, e) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (items) => {
    if (!items || items.length === 0) {
      return (
        <div style={{ padding: '0.8rem', fontSize: '0.78rem', color: '#64748B' }}>
          (No files found)
        </div>
      );
    }

    return items.map((item) => {
      if (item.isDirectory) {
        const isExp = !!expanded[item.path];
        return (
          <div key={item.path}>
            <div
              className="tree-item"
              onClick={(e) => toggleFolder(item.path, e)}
              title={item.path}
            >
              <div className="tree-item-main">
                {isExp ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                {isExp ? (
                  <FolderOpen size={14} style={{ color: '#8B5CF6' }} />
                ) : (
                  <Folder size={14} style={{ color: '#8B5CF6' }} />
                )}
                <span>{item.name}</span>
              </div>
              <div className="tree-item-actions">
                <button
                  className="tree-icon-btn"
                  title="Delete Folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.path, true);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {isExp && item.children && (
              <div className="tree-children">
                {renderTree(item.children)}
              </div>
            )}
          </div>
        );
      }

      const isActive = activeFile && activeFile.path === item.path;

      return (
        <div
          key={item.path}
          className={`tree-item ${isActive ? 'active' : ''}`}
          onClick={() => onSelectFile(item.path)}
          title={item.path}
        >
          <div className="tree-item-main">
            {getFileIcon(item.name)}
            <span>{item.name}</span>
          </div>
          <div className="tree-item-actions">
            <button
              className="tree-icon-btn"
              title="Delete File"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.path, false);
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="file-explorer">
      {renderTree(tree)}
    </div>
  );
}

