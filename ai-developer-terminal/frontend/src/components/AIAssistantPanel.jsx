import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bug, BookOpen, Terminal as TerminalIcon, Check, Copy } from 'lucide-react';
import { api } from '../services/api.js';

export default function AIAssistantPanel({
  activeFile,
  fileContent,
  onApplyCode,
  showToast,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Welcome to Brajesh Kushwaha AI Studio Assistant!**

I am ready to help you architect, write, debug, and review your applications.
- Click **"Explain Code"** to get a walkthrough of your active file.
- Click **"Audit & Debug"** to search for syntax issues and anti-patterns.
- Click **"Terminal Help"** for command syntax recommendations.
- Or type any custom programming question below!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt, overrideMode) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && !fileContent) return;

    const currentMode = overrideMode || mode;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAI({
        prompt: textToSend,
        code: fileContent || '',
        filePath: activeFile?.path || '',
        mode: currentMode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          source: res.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **AI Query Error:** ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleQuickAction = (action) => {
    setMode(action);
    if (action === 'explain') {
      handleSend(`Explain the architecture and flow of ${activeFile ? activeFile.name : 'the code'}.`, 'explain');
    } else if (action === 'debug') {
      handleSend(`Audit for potential bugs, edge cases, and best practices.`, 'debug');
    } else if (action === 'commands') {
      handleSend(`Suggest terminal commands for this workspace.`, 'commands');
    }
  };

  // Helper to extract first code block if present
  const extractCode = (markdown) => {
    const match = markdown.match(/```(?:\w+)?\n([\s\S]*?)```/);
    return match ? match[1] : null;
  };

  return (
    <div className="ai-panel">
      <div className="ai-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: '#22D3EE' }} />
          <span style={{ fontWeight: 600, fontSize: '0.86rem' }}>Brajesh AI Studio Core</span>
        </div>

        <div className="ai-modes-chips">
          <button
            className={`ai-mode-btn ${mode === 'explain' ? 'active' : ''}`}
            onClick={() => handleQuickAction('explain')}
          >
            <BookOpen size={12} style={{ display: 'inline', marginRight: 4 }} />
            Explain Code
          </button>
          <button
            className={`ai-mode-btn ${mode === 'debug' ? 'active' : ''}`}
            onClick={() => handleQuickAction('debug')}
          >
            <Bug size={12} style={{ display: 'inline', marginRight: 4 }} />
            Audit & Debug
          </button>
          <button
            className={`ai-mode-btn ${mode === 'commands' ? 'active' : ''}`}
            onClick={() => handleQuickAction('commands')}
          >
            <TerminalIcon size={12} style={{ display: 'inline', marginRight: 4 }} />
            Commands
          </button>
        </div>
      </div>

      {activeFile && (
        <div style={{ padding: '0.35rem 1.25rem', background: '#0d1322', borderBottom: '1px solid rgba(148,163,184,0.1)', fontSize: '0.74rem', color: '#94a3b8' }}>
          Active File Context: <code style={{ color: '#22d3ee' }}>{activeFile.path}</code> ({fileContent ? fileContent.split('\n').length : 0} lines)
        </div>
      )}

      <div className="ai-messages-list">
        {messages.map((m, idx) => {
          const codeSnippet = m.role === 'assistant' ? extractCode(m.content) : null;

          return (
            <div key={idx} className={`ai-message ${m.role}`}>
              <div className={`ai-avatar ${m.role}`}>
                {m.role === 'assistant' ? <Sparkles size={16} /> : 'ME'}
              </div>
              <div className="ai-bubble">
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>

                {codeSnippet && (
                  <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="editor-btn"
                      onClick={() => handleCopy(codeSnippet, idx)}
                    >
                      {copiedIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    {activeFile && onApplyCode && (
                      <button
                        className="editor-btn save"
                        onClick={() => {
                          onApplyCode(codeSnippet);
                          showToast('Applied AI code to current file in Monaco Editor!', 'success');
                        }}
                      >
                        <span>Apply to {activeFile.name}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="ai-message assistant">
            <div className="ai-avatar assistant">
              <Sparkles size={16} />
            </div>
            <div className="ai-bubble" style={{ color: '#22D3EE' }}>
              Thinking and generating response...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        <input
          type="text"
          className="ai-input-box"
          placeholder="Ask a question or request a code snippet... (Press Enter to submit)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <button
          className="btn-primary"
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !fileContent)}
        >
          <Send size={14} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}

