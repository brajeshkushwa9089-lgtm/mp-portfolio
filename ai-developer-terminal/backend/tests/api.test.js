import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Backend API Endpoints', () => {
  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.studio).toBe('Brajesh Kushwaha AI Studio Console');
  });

  it('POST /api/auth/login should issue a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'brajesh' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('GET /api/files/list should return workspace items', async () => {
    const res = await request(app).get('/api/files/list');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('POST /api/terminal/execute should execute built-in commands', async () => {
    const res = await request(app)
      .post('/api/terminal/execute')
      .send({ command: 'help' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.output).toContain('Brajesh Kushwaha AI Studio Console');
  });

  it('POST /api/ai/query should return AI assistant response', async () => {
    const res = await request(app)
      .post('/api/ai/query')
      .send({ prompt: 'Explain the project structure', mode: 'chat' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.answer).toBeDefined();
  });
});

