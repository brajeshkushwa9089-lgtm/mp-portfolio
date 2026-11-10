import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Sparkles, FileCode, Check } from 'lucide-react';

function getLanguageFromPath(filePath = '') {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.jsx') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.ts')) {
    return 'javascript';
  }
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'html';
  if (lower.endsWith('.css')) return 'css';
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.py')) return 'python';
  if (lower.endsWith('.md')) return 'markdown';
  return 'plaintext';
}

export default function MonacoEditorPanel({
  activeFile,
  fileContent,
  setFileContent,
  onSave,
  onAskAI,
}) {
  const [isDirty, setIsDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setIsDirty(false);
  }, [activeFile?.path]);

  const handleEditorChange = (value) => {
    setFileContent(value);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!activeFile) return;
    await onSave();
    setIsDirty(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  // Shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, fileContent]);

  if (!activeFile) {
    return (
      <div className="editor-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <FileCode size={48} style={{ opacity: 0.4, marginBottom: '1rem', color: '#8B5CF6' }} />
          <h3>No File Open in Monaco Editor</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Select a file from the explorer on the left or type <code>open &lt;filename&gt;</code> in the Terminal.
          </p>
        </div>
      </div>
    );
  }

  const language = getLanguageFromPath(activeFile.name);

  return (
    <div className="editor-panel">
      <div className="editor-top-bar">
        <div className="editor-file-info">
          {isDirty && <span className="unsaved-dot" title="Unsaved changes" />}
          <span>{activeFile.path}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>({language})</span>
        </div>

        <div className="editor-controls">
          <button className="editor-btn" onClick={() => onAskAI(activeFile.path, fileContent)} title="Ask AI about this code">
            <Sparkles size={13} style={{ color: '#22D3EE' }} />
            <span>AI Review</span>
          </button>

          <button className="editor-btn save" onClick={handleSave} title="Save File (Ctrl+S)">
            {justSaved ? <Check size={13} /> : <Save size={13} />}
            <span>{justSaved ? 'Saved!' : 'Save (Ctrl+S)'}</span>
          </button>
        </div>
      </div>

      <div className="monaco-wrapper">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={fileContent}
          onChange={handleEditorChange}
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            tabSize: 2,
            lineNumbers: 'on',
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}

