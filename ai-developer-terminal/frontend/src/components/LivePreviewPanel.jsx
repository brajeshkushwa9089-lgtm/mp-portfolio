import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  RefreshCw,
  Play,
  Square,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Terminal as TerminalIcon,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api.js';

export default function LivePreviewPanel({ cwd, showToast }) {
  const [device, setDevice] = useState('desktop');
  const [isRunning, setIsRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [targetPath, setTargetPath] = useState(cwd || '');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    setTargetPath(cwd || '');
  }, [cwd]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const res = await api.getPreviewStatus();
      if (res.active && res.preview) {
        setIsRunning(true);
        setPreviewUrl(res.preview.url);
      } else {
        setIsRunning(false);
      }

      const logRes = await api.getPreviewLogs();
      if (logRes.logs) {
        setLogs(logRes.logs);
      }
    } catch {
      // ignore polling errors
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await api.startPreview(targetPath, 5200);
      setIsRunning(true);
      setPreviewUrl(res.preview.url);
      showToast(`Preview started at ${res.preview.url}`, 'success');
      await checkStatus();
    } catch (err) {
      showToast(`Failed to start preview: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await api.stopPreview();
      setIsRunning(false);
      setPreviewUrl('');
      showToast('Preview server stopped', 'success');
      await checkStatus();
    } catch (err) {
      showToast(`Error stopping preview: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    if (iframeRef.current && previewUrl) {
      iframeRef.current.src = previewUrl;
    }
  };

  return (
    <div className="preview-panel">
      <div className="preview-nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isRunning ? (
            <button className="editor-btn" onClick={handleStop} disabled={loading} style={{ background: '#7f1d1d', borderColor: '#ef4444' }}>
              <Square size={12} fill="#ef4444" />
              <span>Stop Server</span>
            </button>
          ) : (
            <button className="editor-btn" onClick={handleStart} disabled={loading} style={{ background: '#064e3b', borderColor: '#10b981' }}>
              <Play size={12} fill="#10b981" />
              <span>{loading ? 'Starting...' : 'Start Preview'}</span>
            </button>
          )}

          <button className="sidebar-btn" onClick={handleReload} disabled={!isRunning} title="Reload Preview Frame">
            <RefreshCw size={13} />
          </button>
        </div>

        <div className="preview-address-bar">
          <Globe size={13} />
          <input
            type="text"
            className="preview-address-input"
            value={previewUrl || `Target: workspace/${targetPath || '(root)'}`}
            readOnly
          />
        </div>

        <div className="device-viewport-controls">
          <button
            className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
            onClick={() => setDevice('desktop')}
            title="Desktop (100%)"
          >
            <Monitor size={14} />
          </button>
          <button
            className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
            onClick={() => setDevice('tablet')}
            title="Tablet (768px)"
          >
            <Tablet size={14} />
          </button>
          <button
            className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
            onClick={() => setDevice('mobile')}
            title="Mobile (375px)"
          >
            <Smartphone size={14} />
          </button>
        </div>

        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="action-icon-btn"
            title="Open in New Browser Tab"
          >
            <ExternalLink size={13} />
          </a>
        )}

        <button
          className="action-icon-btn"
          onClick={() => setShowLogs(!showLogs)}
          title="Toggle Server Logs Drawer"
        >
          <TerminalIcon size={13} />
          <span>Logs</span>
          {showLogs ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
        </button>
      </div>

      <div className="preview-stage">
        {isRunning && previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Project Live Preview"
            className={`preview-iframe ${device}`}
          />
        ) : (
          <div className="preview-empty-state">
            <Globe size={48} style={{ opacity: 0.3, color: '#22D3EE' }} />
            <h3>Live Preview Server Inactive</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', lineHeight: 1.6 }}>
              Click <strong>Start Preview</strong> to serve <code>workspace/{targetPath || ''}</code>.
              Your web pages and components will be rendered here with live responsiveness.
            </p>
            <button className="btn-primary" onClick={handleStart} disabled={loading}>
              <Play size={14} fill="#ffffff" />
              <span>Launch Live Preview</span>
            </button>
          </div>
        )}
      </div>

      {showLogs && (
        <div className="preview-logs-drawer">
          <div style={{ fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
            [Live Preview Server Output]
          </div>
          {logs.length === 0 ? (
            <div style={{ color: '#64748B' }}>No log entries recorded yet.</div>
          ) : (
            logs.map((line, idx) => <div key={idx}>{line}</div>)
          )}
        </div>
      )}
    </div>
  );
}

