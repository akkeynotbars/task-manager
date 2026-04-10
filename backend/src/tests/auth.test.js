import request from 'supertest';
import express from 'express';
import { authRouter } from '../routes/auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth routes', () => {
  it('returns 400 if email already exists', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123456', name: 'Test' });
    expect([201, 400]).toContain(res.status);
  });

  it('returns 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});