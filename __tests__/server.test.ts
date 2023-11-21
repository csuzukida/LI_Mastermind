import request from 'supertest';
import app, { startServer, stopServer } from '../src/server/server';

beforeAll(async () => {
  await startServer();
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});

afterAll(async () => {
  await stopServer();
});
