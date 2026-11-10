import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'success'}`}>
          {t.type === 'error' ? (
            <AlertTriangle size={15} style={{ color: '#FF5F56' }} />
          ) : (
            <CheckCircle2 size={15} style={{ color: '#22D3EE' }} />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

