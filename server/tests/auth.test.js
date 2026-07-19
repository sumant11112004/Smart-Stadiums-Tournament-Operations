const request = require('supertest');
const app = require('../server');

describe('Authentication API Endpoint Tests', () => {
  const testUser = {
    name: 'Test Fan',
    email: `testfan-${Date.now()}@fifa.com`,
    password: 'password123'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.name).toBe(testUser.name);
    expect(res.body.email).toBe(testUser.email);
  });

  it('should login with the newly registered user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should deny access if logging in with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should allow demo admin quick-login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@fifa.com',
        password: 'admin123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('admin');
    expect(res.body).toHaveProperty('token');
  });
});
