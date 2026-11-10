import React, { useState } from 'react';
import { FolderTree, FilePlus, FolderPlus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import FileExplorer from './FileExplorer.jsx';

export default function Sidebar({
  tree,
  activeFile,
  onSelectFile,
  onDelete,
  onRefresh,
  onCreateFile,
  onCreateFolder,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <FolderTree size={14} style={{ color: '#22D3EE' }} />
          <span>Explorer</span>
        </div>
        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={onCreateFile} title="New File">
            <FilePlus size={13} />
          </button>
          <button className="sidebar-btn" onClick={onCreateFolder} title="New Folder">
            <FolderPlus size={13} />
          </button>
          <button className="sidebar-btn" onClick={onRefresh} title="Refresh Explorer">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <FileExplorer
          tree={tree}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
          onDelete={onDelete}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
        />
      </div>
    </aside>
  );
}

