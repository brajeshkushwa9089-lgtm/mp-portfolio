import React from 'react';
import { Terminal, FolderGit2, Play, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

export default function TopBar({
  currentPath,
  serverStatus,
  onRefresh,
  onOpenProjectBuilder,
  activeTab,
  setActiveTab,
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="window-dots">
          <span className="window-dot dot-close" title="Close Window" />
          <span className="window-dot dot-min" title="Minimize Window" />
          <span className="window-dot dot-max" title="Maximize Window" />
        </div>

        <div className="brand-badge">
          <Cpu className="brand-logo-icon" size={18} />
          <span className="brand-title">Brajesh AI Studio</span>
          <span className="brand-version">v1.0.0</span>
        </div>
      </div>

      <div className="topbar-center">
        <FolderGit2 size={14} style={{ color: '#22D3EE' }} />
        <span>workspace/{currentPath || ''}</span>
      </div>

      <div className="topbar-right">
        <div className={`status-indicator ${serverStatus === 'connected' ? 'online' : 'offline'}`}>
          <span className="pulse-dot" />
          <span>{serverStatus === 'connected' ? 'Studio Engine Online' : 'Connecting...'}</span>
        </div>

        <button className="action-icon-btn" onClick={onOpenProjectBuilder} title="Create New Project">
          <span>+ New Project</span>
        </button>

        <button className="action-icon-btn" onClick={onRefresh} title="Refresh Workspace">
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
}

