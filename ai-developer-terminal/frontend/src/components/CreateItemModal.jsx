import React, { useState } from 'react';

export default function CreateItemModal({ isOpen, isFolder, onClose, onSubmit }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem', color: '#F8FAFC' }}>
          {isFolder ? 'Create New Folder' : 'Create New File'}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input"
            autoFocus
            placeholder={isFolder ? 'e.g. components' : 'e.g. index.js'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

