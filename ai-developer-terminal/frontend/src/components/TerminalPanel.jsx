import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { api } from '../services/api.js';
import { Trash2, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

const COMMON_COMMANDS = [
  'help',
  'about',
  'pwd',
  'ls',
  'tree',
  'cd',
  'cat',
  'touch',
  'mkdir',
  'open',
  'write',
  'projects',
  'create my-app react',
  'run dev',
  'preview',
  'git status',
  'ai what is this project about?',
  'clear',
];

export default function TerminalPanel({ cwd, setCwd, onOpenFile, onTriggerPreview }) {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const fitAddonRef = useRef(null);

  const [history, setHistory] = useState([]);
  const historyIndex = useRef(-1);
  const currentLine = useRef('');
  const cwdRef = useRef(cwd);
  cwdRef.current = cwd;

  const promptText = () => {
    const displayDir = cwdRef.current ? `~/${cwdRef.current}` : '~';
    return `\x1b[1;36mdev@brajesh_ai\x1b[0m:\x1b[1;35m${displayDir}\x1b[0m$ `;
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
      fontSize: 13,
      lineHeight: 1.25,
      theme: {
        background: '#050811',
        foreground: '#F8FAFC',
        cursor: '#22D3EE',
        cursorAccent: '#070B18',
        selectionBackground: 'rgba(139, 92, 246, 0.3)',
        black: '#070B18',
        red: '#EF4444',
        green: '#10B981',
        yellow: '#F59E0B',
        blue: '#3B82F6',
        magenta: '#8B5CF6',
        cyan: '#22D3EE',
        white: '#F8FAFC',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermInstance.current = term;
    fitAddonRef.current = fitAddon;

    // Banner message
    term.writeln('\x1b[1;36m╔═════════════════════════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[1;36m║            \x1b[1;35mBRAJESH KUSHWAHA AI STUDIO CONSOLE — TERMINAL v1.0\x1b[1;36m           ║\x1b[0m');
    term.writeln('\x1b[1;36m╚═════════════════════════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('\x1b[90mType \x1b[1;33mhelp\x1b[90m for commands or click quick chips above. Tab for autocomplete.\x1b[0m\r\n');
    term.write(promptText());

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch {
        // ignore
      }
    };
    window.addEventListener('resize', handleResize);

    // Key handler
    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.key === 'Enter') {
        const cmd = currentLine.current.trim();
        term.writeln('');

        if (cmd) {
          setHistory((prev) => [...prev, cmd]);
          historyIndex.current = -1;
          executeTerminalCommand(cmd);
        } else {
          term.write(promptText());
        }
        currentLine.current = '';
      } else if (domEvent.key === 'Backspace') {
        if (currentLine.current.length > 0) {
          currentLine.current = currentLine.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (domEvent.key === 'ArrowUp') {
        domEvent.preventDefault();
        setHistory((prevHist) => {
          if (prevHist.length === 0) return prevHist;
          const newIdx = historyIndex.current === -1 ? prevHist.length - 1 : Math.max(0, historyIndex.current - 1);
          historyIndex.current = newIdx;
          const chosen = prevHist[newIdx];
          while (currentLine.current.length > 0) {
            term.write('\b \b');
            currentLine.current = currentLine.current.slice(0, -1);
          }
          currentLine.current = chosen;
          term.write(chosen);
          return prevHist;
        });
      } else if (domEvent.key === 'ArrowDown') {
        domEvent.preventDefault();
        setHistory((prevHist) => {
          if (prevHist.length === 0 || historyIndex.current === -1) return prevHist;
          const newIdx = historyIndex.current + 1;
          if (newIdx >= prevHist.length) {
            historyIndex.current = -1;
            while (currentLine.current.length > 0) {
              term.write('\b \b');
              currentLine.current = currentLine.current.slice(0, -1);
            }
          } else {
            historyIndex.current = newIdx;
            const chosen = prevHist[newIdx];
            while (currentLine.current.length > 0) {
              term.write('\b \b');
              currentLine.current = currentLine.current.slice(0, -1);
            }
            currentLine.current = chosen;
            term.write(chosen);
          }
          return prevHist;
        });
      } else if (domEvent.key === 'Tab') {
        domEvent.preventDefault();
        const input = currentLine.current.toLowerCase();
        if (input) {
          const match = COMMON_COMMANDS.find((c) => c.startsWith(input));
          if (match && match !== input) {
            const remainder = match.slice(input.length);
            currentLine.current += remainder;
            term.write(remainder);
          }
        }
      } else if (printable && domEvent.key.length === 1) {
        currentLine.current += key;
        term.write(key);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  const executeTerminalCommand = async (commandStr) => {
    const term = xtermInstance.current;
    if (!term) return;

    if (commandStr === 'clear') {
      term.clear();
      term.write(promptText());
      return;
    }

    try {
      const res = await api.executeCommand(commandStr, cwdRef.current);

      if (res.newCwd !== undefined) {
        setCwd(res.newCwd);
        cwdRef.current = res.newCwd;
      }

      if (res.output) {
        const lines = res.output.split('\n');
        lines.forEach((line) => {
          term.writeln(line.replace(/\r?\n/g, '\r\n'));
        });
      }

      if (res.error) {
        const errLines = res.error.split('\n');
        errLines.forEach((line) => {
          term.writeln(`\x1b[31m${line}\x1b[0m`);
        });
      }

      if (res.openFile && onOpenFile) {
        onOpenFile(res.openFile);
      }

      if (res.previewUrl && onTriggerPreview) {
        onTriggerPreview(res.previewUrl);
      }
    } catch (err) {
      term.writeln(`\x1b[31mExecution error: ${err.message}\x1b[0m`);
    }

    term.write(`\r\n${promptText()}`);
  };

  const handleChipClick = (cmd) => {
    const term = xtermInstance.current;
    if (!term) return;

    while (currentLine.current.length > 0) {
      term.write('\b \b');
      currentLine.current = currentLine.current.slice(0, -1);
    }

    term.writeln(cmd);
    executeTerminalCommand(cmd);
  };

  const handleClear = () => {
    const term = xtermInstance.current;
    if (term) {
      term.clear();
      currentLine.current = '';
      term.write(promptText());
    }
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TerminalIcon size={14} style={{ color: '#22D3EE' }} />
          <span>Brajesh AI Studio PTY</span>
        </div>

        <button className="sidebar-btn" onClick={handleClear} title="Clear Terminal Screen">
          <Trash2 size={13} />
        </button>
      </div>

      <div className="terminal-suggestions">
        <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} /> Quick:
        </span>
        {COMMON_COMMANDS.slice(0, 8).map((cmd) => (
          <button key={cmd} className="suggestion-chip" onClick={() => handleChipClick(cmd)}>
            {cmd}
          </button>
        ))}
      </div>

      <div className="terminal-container" ref={terminalRef} />
    </div>
  );
}

