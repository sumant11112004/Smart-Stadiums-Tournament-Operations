const request = require('supertest');
const app = require('../server');

describe('Feedback / Contact API Endpoint Tests', () => {
  const validMessage = {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    subject: 'Operational Enquiry',
    message: 'Hello, I would like to enquire about VIP parking spaces and shuttle timetables for Host City. Thank you!'
  };

  it('should accept valid feedback submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send(validMessage);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.name).toBe(validMessage.name);
    expect(res.body.data.email).toBe(validMessage.email);
  });

  it('should reject submission with invalid email format', async () => {
    const invalidMsg = { ...validMessage, email: 'invalidemail' };
    const res = await request(app)
      .post('/api/contact')
      .send(invalidMsg);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('valid email');
  });

  it('should reject submission with short message text', async () => {
    const shortMsg = { ...validMessage, message: 'Short' };
    const res = await request(app)
      .post('/api/contact')
      .send(shortMsg);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('at least 10 characters');
  });

  it('should reject submission if required fields are missing', async () => {
    const incompleteMsg = { name: 'Jane Doe', email: 'jane@example.com' };
    const res = await request(app)
      .post('/api/contact')
      .send(incompleteMsg);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
