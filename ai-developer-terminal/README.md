# ⚡ Brajesh Kushwaha AI Studio Console (AI Developer Terminal)

> A modern, browser-based cloud development studio featuring xterm.js virtual terminal, Monaco Code Editor, automated project scaffolders, responsive live preview server, and an integrated AI coding assistant.

---

## 🚀 Key Features

- **💻 Virtual Developer Terminal**: Powered by `xterm.js` and `@xterm/addon-fit` with auto-scaling, command history, tab autocomplete, ANSI colors, and a sandboxed process interpreter.
- **📝 Monaco Code Editor**: Full-featured code editor with syntax highlighting for JavaScript, JSX, TypeScript, HTML, CSS, JSON, Markdown, and Python, with dirty-state indicators and `Ctrl+S` auto-save.
- **🛠️ Project Builder**: Instant project scaffolding for:
  - **React + Vite Frontend** (`react`)
  - **Node.js + Express REST API** (`node`)
  - **Full-Stack Application** (`fullstack`)
  - **Vanilla HTML5 / CSS3 / JavaScript** (`html`)
- **🌐 Responsive Live Preview**: Embedded live iframe preview with Desktop, Tablet, and Mobile viewport modes, real-time address bar, reload controls, and live server logs drawer.
- **🤖 AI Studio Assistant**: Intelligent code analysis, architectural explanations, bug audits, terminal command suggestions, and one-click **"Apply to Editor"** updates. Operates with OpenAI API or automatically falls back to an offline heuristic code intelligence engine.
- **🛡️ Enterprise Security**:
  - Strict path traversal protection (`safeResolvePath` with symlink and null-byte defenses confined to `workspace/`).
  - Command allowlist (`node`, `npm`, `npx`, `git`, `python`, `ls`, `cat`, etc.) executed via Node `child_process.spawn()` with structured argument arrays.
  - Zero raw shell string concatenation or command injection vulnerabilities.
  - Helmet security headers, CORS isolation, JWT authentication, and rate limiting.

---

## 📁 Project Architecture

```
ai-developer-terminal/
├── frontend/                     # React 19 + Vite Application
│   ├── src/
│   │   ├── components/           # TopBar, Sidebar, Terminal, Monaco Editor, Preview, AI
│   │   ├── services/             # API client & backend bridge
│   │   ├── styles/               # Glassmorphic, dark navy UI styling
│   │   ├── __tests__/            # Frontend Vitest test suites
│   │   ├── App.jsx               # Main workspace state container
│   │   └── main.jsx
│   ├── public/                   # Favicon and assets
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with proxy to backend
│   └── package.json
│
├── backend/                      # Node.js + Express API (MVC Architecture)
│   ├── src/
│   │   ├── controllers/          # Auth, File, Command, Project, Preview, AI
│   │   ├── routes/               # Modular Express routers
│   │   ├── services/             # File, Command, Project, Preview, AI logic
│   │   ├── middleware/           # Auth, RateLimiter, ErrorHandler
│   │   ├── utils/                # Security path sanitizer, command parser, logger
│   │   ├── workspace/            # Secure isolated developer workspace
│   │   └── server.js             # Express app setup and middleware pipeline
│   ├── tests/                    # Security, path confinement, and API tests
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js v24)
- **npm**: v9+

### 2. Setup Backend
```bash
cd ai-developer-terminal/backend
npm.cmd install          # On Windows, use npm.cmd
npm.cmd start            # Starts backend on http://localhost:4000
```

### 3. Setup Frontend
```bash
cd ai-developer-terminal/frontend
npm.cmd install          # On Windows, use npm.cmd
npm.cmd run dev          # Starts dev server on http://localhost:5173
```

Now open **`http://localhost:5173`** in your browser.

---

## 💻 Terminal Command Reference

| Command | Arguments | Description |
| :--- | :--- | :--- |
| `help` | — | Display supported command list and syntax |
| `about` | — | Print console details, architect info, and status |
| `pwd` | — | Print active relative workspace directory |
| `ls` | `[path]` | List files and directories with sizes |
| `tree` | `[path]` | Render visual ASCII directory tree |
| `cd` | `<path>` | Navigate into workspace directories (`cd ..` to return) |
| `cat` | `<file>` | Display text file contents |
| `touch` | `<file>` | Create a new empty file |
| `mkdir` | `<dir>` | Create a new directory |
| `open` | `<file>` | Open file in the Monaco Code Editor |
| `write` | `<file> <text>` | Write or append text directly to a file |
| `projects` | — | List all created project folders |
| `create` | `<name> <template>` | Scaffold `react`, `node`, `fullstack`, or `html` |
| `run` | `<task>` | Execute project script (e.g. `run dev`, `run build`) |
| `preview` | — | Display preview URL and server status |
| `git status` | — | Check git repository status |
| `ai` | `<prompt>` | Ask AI Studio assistant for code advice |
| `clear` | — | Clear terminal screen |

---

## 🧪 Running Automated Tests

### Backend Tests (Security & API)
```bash
cd ai-developer-terminal/backend
npm.cmd test
```

### Frontend Tests (Component Rendering)
```bash
cd ai-developer-terminal/frontend
npm.cmd test
```

---

## 🔒 Security & Sandboxing Guarantee
- **Strict Boundary**: All operations are restricted to `backend/src/workspace/`.
- **Traversal Defense**: Any attempt to read or write paths containing `../` or symlinks pointing outside the workspace throws an immediate `403 Access Denied` error.
- **Process Safety**: Child processes are executed strictly via allowlisted binaries using argument vectors, never passed directly to a raw system shell string.

---

**Developed for Brajesh Kushwaha AI Studio Console.**

