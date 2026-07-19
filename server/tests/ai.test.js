const request = require('supertest');
const app = require('../server');

describe('GenAI Core API Endpoint Tests', () => {
  it('should get responsive answers from AI Stadium Assistant for gates', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ query: 'Which gate is closest to Section 102?' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body.query).toBe('Which gate is closest to Section 102?');
  });

  it('should explain offside rules in AI Match Companion', async () => {
    const res = await request(app)
      .post('/api/ai/companion')
      .send({ query: 'explain offside' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body.response).toContain('Offside');
  });

  it('should retrieve recommendations in Sustainability Dashboard', async () => {
    const res = await request(app)
      .post('/api/ai/sustainability')
      .send({}); // Empty query triggers defaults

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body.response).toContain('Energy');
  });
});
