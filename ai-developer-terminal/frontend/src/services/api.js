const API_BASE = '/api';

let authToken = localStorage.getItem('brajesh_ai_token') || '';

export function setToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('brajesh_ai_token', token);
  } else {
    localStorage.removeItem('brajesh_ai_token');
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : { 'X-Demo-User': 'brajesh_developer' }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = `Server error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errorMsg;
    } catch {
      // Ignore json parse error on non-json error responses
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(username = 'developer') {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  async getProfile() {
    return request('/auth/me');
  },

  async checkHealth() {
    return request('/health');
  },

  // Files
  async listFiles(path = '') {
    return request(`/files/list?path=${encodeURIComponent(path)}`);
  },

  async getFileTree(path = '') {
    return request(`/files/tree?path=${encodeURIComponent(path)}`);
  },

  async readFile(path) {
    return request(`/files/read?path=${encodeURIComponent(path)}`);
  },

  async writeFile(path, content) {
    return request('/files/write', {
      method: 'POST',
      body: JSON.stringify({ path, content }),
    });
  },

  async createDirectory(path) {
    return request('/files/mkdir', {
      method: 'POST',
      body: JSON.stringify({ path }),
    });
  },

  async deleteItem(path) {
    return request(`/files/delete?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
    });
  },

  async renameItem(oldPath, newPath) {
    return request('/files/rename', {
      method: 'POST',
      body: JSON.stringify({ oldPath, newPath }),
    });
  },

  // Terminal
  async executeCommand(command, cwd = '') {
    return request('/terminal/execute', {
      method: 'POST',
      body: JSON.stringify({ command, cwd }),
    });
  },

  // Projects
  async listProjects() {
    return request('/projects');
  },

  async createProject(name, template) {
    return request('/projects/create', {
      method: 'POST',
      body: JSON.stringify({ name, template }),
    });
  },

  // Preview
  async startPreview(projectPath = '', port = 5200) {
    return request('/preview/start', {
      method: 'POST',
      body: JSON.stringify({ projectPath, port }),
    });
  },

  async stopPreview() {
    return request('/preview/stop', {
      method: 'POST',
    });
  },

  async getPreviewStatus() {
    return request('/preview/status');
  },

  async getPreviewLogs() {
    return request('/preview/logs');
  },

  // AI Assistant
  async askAI({ prompt, code, filePath, mode }) {
    return request('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ prompt, code, filePath, mode }),
    });
  },
};

