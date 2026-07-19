const request = require('supertest');
const app = require('../server');

describe('Admin Dashboard API Endpoint Tests', () => {
  let adminToken;

  beforeAll(async () => {
    // Authenticate as demo admin to get valid token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@fifa.com',
        password: 'admin123'
      });
    adminToken = res.body.token;
  });

  it('should deny access if no token is provided', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard');

    expect(res.statusCode).toBe(401);
  });

  it('should deny access if non-admin token is provided', async () => {
    // Login as a normal user first
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@fifa.com',
        password: 'user123'
      });
    const userToken = loginRes.body.token;

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should retrieve dashboard metrics successfully for admin user', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('aiQueries');
    expect(res.body).toHaveProperty('activeAlerts');
    expect(res.body).toHaveProperty('densityDistribution');
    expect(res.body).toHaveProperty('recentQueries');
    expect(res.body).toHaveProperty('recentFeedback');
  });
});
