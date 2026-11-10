import React, { useState } from 'react';
import { api } from '../services/api.js';
import { Rocket, Layers, Server, Globe2, CheckCircle2, AlertCircle } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'react',
    name: 'React + Vite Frontend',
    desc: 'Modern, blazing fast Single Page App with React 19, Vite, and component scaffolding.',
    icon: '⚛️',
    tags: ['React', 'Vite', 'ESModules', 'SPA'],
  },
  {
    id: 'node',
    name: 'Node.js Express REST API',
    desc: 'Lightweight backend server with Express, CORS, health endpoints, and modular structure.',
    icon: '🟢',
    tags: ['Node.js', 'Express', 'API', 'JSON'],
  },
  {
    id: 'fullstack',
    name: 'Full-Stack React + Express',
    desc: 'Complete fullstack architecture with combined client and server workspaces.',
    icon: '⚡',
    tags: ['FullStack', 'Client/Server', 'Monorepo'],
  },
  {
    id: 'html',
    name: 'Vanilla HTML5 / CSS3 / JS',
    desc: 'Zero-build static web application. Instant live preview with no dependencies needed.',
    icon: '🌐',
    tags: ['HTML5', 'Modern CSS', 'Vanilla JS', 'Instant'],
  },
];

export default function ProjectBuilderModal({ onProjectCreated, showToast }) {
  const [selectedTemplate, setSelectedTemplate] = useState('react');
  const [projectName, setProjectName] = useState('my-ai-app');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      showToast('Please enter a project name', 'error');
      return;
    }

    setLoading(true);
    setStatusMessage('Scaffolding template architecture...');

    try {
      const res = await api.createProject(projectName.trim(), selectedTemplate);
      setStatusMessage('Project initialized successfully!');
      showToast(`Created project '${projectName}'!`, 'success');

      if (onProjectCreated) {
        onProjectCreated(res.project);
      }
    } catch (err) {
      setStatusMessage(null);
      showToast(`Creation failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="builder-panel">
      <div className="builder-container">
        <div className="builder-header">
          <h2 className="builder-title">Project Template Scaffolder</h2>
          <p className="builder-subtitle">
            Generate production-ready application architectures with starter code, configuration, and documentation.
          </p>
        </div>

        <div className="template-grid">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className={`template-card ${selectedTemplate === tmpl.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(tmpl.id)}
            >
              <div className="template-icon">{tmpl.icon}</div>
              <div className="template-name">{tmpl.name}</div>
              <div className="template-desc">{tmpl.desc}</div>
              <div className="template-tags">
                {tmpl.tags.map((tag) => (
                  <span key={tag} className="template-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form className="builder-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Project Directory Name</label>
            <input
              type="text"
              className="form-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="e.g. portfolio-dashboard"
              disabled={loading}
              required
            />
            <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.3rem', display: 'block' }}>
              Allowed characters: letters, numbers, hyphens, underscores. Scaffolds to <code>workspace/{projectName}</code>.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: '#22D3EE' }}>
              {statusMessage && `⚡ ${statusMessage}`}
            </span>

            <button type="submit" className="btn-primary" disabled={loading}>
              <Rocket size={15} />
              <span>{loading ? 'Generating Starter Files...' : 'Scaffold & Initialize Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

