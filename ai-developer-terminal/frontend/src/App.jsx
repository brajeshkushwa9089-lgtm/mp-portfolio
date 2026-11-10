import React, { useState, useEffect } from 'react';
import './styles/App.css';

import { api } from './services/api.js';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import TabNav from './components/TabNav.jsx';
import TerminalPanel from './components/TerminalPanel.jsx';
import MonacoEditorPanel from './components/MonacoEditorPanel.jsx';
import ProjectBuilderModal from './components/ProjectBuilderModal.jsx';
import LivePreviewPanel from './components/LivePreviewPanel.jsx';
import AIAssistantPanel from './components/AIAssistantPanel.jsx';
import CreateItemModal from './components/CreateItemModal.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [serverStatus, setServerStatus] = useState('connecting');
  const [cwd, setCwd] = useState('');
  const [tree, setTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [previewRunning, setPreviewRunning] = useState(false);

  // Modals state
  const [createModal, setCreateModal] = useState({ open: false, isFolder: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, path: '', isFolder: false });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Initial setup: Authenticate and load workspace tree
  useEffect(() => {
    const initApp = async () => {
      try {
        await api.login('brajesh_dev');
        const health = await api.checkHealth();
        if (health.status === 'healthy') {
          setServerStatus('connected');
        }
        await loadTree();
      } catch (err) {
        setServerStatus('error');
        showToast('Connecting to backend server...', 'error');
      }
    };
    initApp();
  }, []);

  const loadTree = async () => {
    try {
      const res = await api.getFileTree();
      if (res.success) {
        setTree(res.tree);
      }
    } catch (err) {
      console.error('Failed to load file tree:', err);
    }
  };

  // Open a file
  const handleSelectFile = async (filePath) => {
    try {
      const data = await api.readFile(filePath);
      setActiveFile({ path: data.path, name: data.name, extension: data.extension });
      setFileContent(data.content);
      setActiveTab('editor');
    } catch (err) {
      showToast(`Error opening file: ${err.message}`, 'error');
    }
  };

  // Save current active file
  const handleSaveFile = async () => {
    if (!activeFile) return;
    try {
      await api.writeFile(activeFile.path, fileContent);
      showToast(`Saved ${activeFile.name}`, 'success');
      await loadTree();
    } catch (err) {
      showToast(`Failed to save: ${err.message}`, 'error');
    }
  };

  // Create new file or folder
  const handleCreateItem = async (name) => {
    try {
      const targetPath = cwd ? `${cwd}/${name}` : name;
      if (createModal.isFolder) {
        await api.createDirectory(targetPath);
        showToast(`Created directory ${name}`, 'success');
      } else {
        await api.writeFile(targetPath, '');
        showToast(`Created file ${name}`, 'success');
        handleSelectFile(targetPath);
      }
      await loadTree();
    } catch (err) {
      showToast(`Creation failed: ${err.message}`, 'error');
    }
  };

  // Delete file or folder
  const handleConfirmDelete = async () => {
    const targetPath = deleteModal.path;
    try {
      await api.deleteItem(targetPath);
      showToast(`Deleted ${targetPath}`, 'success');
      if (activeFile && activeFile.path === targetPath) {
        setActiveFile(null);
        setFileContent('');
      }
      setDeleteModal({ open: false, path: '', isFolder: false });
      await loadTree();
    } catch (err) {
      showToast(`Deletion error: ${err.message}`, 'error');
    }
  };

  // When a project is created from the template scaffolder
  const handleProjectCreated = async (project) => {
    setCwd(project.name);
    await loadTree();
    setActiveTab('editor');
    // Try opening readme of project
    try {
      await handleSelectFile(`${project.name}/README.md`);
    } catch {
      // fallback
    }
  };

  return (
    <div className="app-wrapper">
      <TopBar
        currentPath={cwd}
        serverStatus={serverStatus}
        onRefresh={loadTree}
        onOpenProjectBuilder={() => setActiveTab('builder')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="workspace-layout">
        <Sidebar
          tree={tree}
          activeFile={activeFile}
          onSelectFile={handleSelectFile}
          onDelete={(path, isFolder) => setDeleteModal({ open: true, path, isFolder })}
          onRefresh={loadTree}
          onCreateFile={() => setCreateModal({ open: true, isFolder: false })}
          onCreateFolder={() => setCreateModal({ open: true, isFolder: true })}
        />

        <main className="main-content">
          <TabNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeFile={activeFile}
            previewRunning={previewRunning}
          />

          <div className="panel-viewport">
            {activeTab === 'terminal' && (
              <TerminalPanel
                cwd={cwd}
                setCwd={setCwd}
                onOpenFile={handleSelectFile}
                onTriggerPreview={() => setActiveTab('preview')}
              />
            )}

            {activeTab === 'editor' && (
              <MonacoEditorPanel
                activeFile={activeFile}
                fileContent={fileContent}
                setFileContent={setFileContent}
                onSave={handleSaveFile}
                onAskAI={(path, content) => setActiveTab('ai')}
              />
            )}

            {activeTab === 'builder' && (
              <ProjectBuilderModal
                onProjectCreated={handleProjectCreated}
                showToast={showToast}
              />
            )}

            {activeTab === 'preview' && (
              <LivePreviewPanel
                cwd={cwd}
                showToast={showToast}
              />
            )}

            {activeTab === 'ai' && (
              <AIAssistantPanel
                activeFile={activeFile}
                fileContent={fileContent}
                onApplyCode={(code) => setFileContent(code)}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>

      <CreateItemModal
        isOpen={createModal.open}
        isFolder={createModal.isFolder}
        onClose={() => setCreateModal({ open: false, isFolder: false })}
        onSubmit={handleCreateItem}
      />

      <ConfirmModal
        isOpen={deleteModal.open}
        title={`Delete ${deleteModal.isFolder ? 'Folder' : 'File'}?`}
        message={`Are you sure you want to permanently delete '${deleteModal.path}' from your workspace?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ open: false, path: '', isFolder: false })}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

