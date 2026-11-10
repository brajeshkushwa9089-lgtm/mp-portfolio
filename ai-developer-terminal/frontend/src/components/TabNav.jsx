import React from 'react';
import { Terminal, Code2, Rocket, Globe, Sparkles } from 'lucide-react';

export default function TabNav({ activeTab, setActiveTab, activeFile, previewRunning }) {
  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: Terminal, badge: 'CLI' },
    { id: 'editor', label: 'Code Editor', icon: Code2, badge: activeFile ? activeFile.name : null },
    { id: 'builder', label: 'Project Builder', icon: Rocket, badge: null },
    { id: 'preview', label: 'Live Preview', icon: Globe, badge: previewRunning ? 'ACTIVE' : null },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles, badge: 'PRO' },
  ];

  return (
    <div className="tab-nav">
      <div className="tabs-list">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge && <span className="tab-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

