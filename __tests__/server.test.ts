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

describe('GET /api/random-numbers', () => {
  it('should return an array of 4 numbers', async () => {
    const res = await request(app).get('/api/random-numbers?length=4&min=0&max=9');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body).toEqual(expect.arrayContaining([expect.any(Number)]));
  });

  it('should return an error if length is less than 3', async () => {
    const res = await request(app).get('/api/random-numbers?length=2&min=0&max=9');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should return an error if length is greater than 10', async () => {
    const res = await request(app).get('/api/random-numbers?length=11&min=0&max=9');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should return an error if min is less than 0', async () => {
    const res = await request(app).get('/api/random-numbers?length=4&min=-1&max=9');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should return an error if min is greater than 9', async () => {
    const res = await request(app).get('/api/random-numbers?length=4&min=10&max=9');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should return an error if max is greater than 9', async () => {
    const res = await request(app).get('/api/random-numbers?length=4&min=0&max=10');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveLength(1);
  });

  it('should return an error if min is greater than max', async () => {
    const res = await request(app).get('/api/random-numbers?length=4&min=5&max=4');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Min cannot be greater than max');
  });
});

describe('POST /api/users/signup', () => {
  // create an agent to store cookies
  const agent = request.agent(app);

  it('should create a user in the DB', async () => {
    const res = await agent
      .post('/api/users/signup')
      .send({ email: 'testEmail_testingRoutes@example.com', password: 'password' });
    expect(res.status).toBe(201);
  });
});

describe('POST /api/users/login', () => {
  const agent = request.agent(app);

  it('should let a user login', async () => {
    const res = await agent
      .post('/api/users/login')
      .send({ email: 'testEmail_testingRoutes@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('login successful');
  });
});

describe('POST /api/users/logout', () => {
  const agent = request.agent(app);

  it('should let a user logout', async () => {
    await agent.post('/api/users/login').send({
      email: 'testEmail_testingRoutes@example.com',
      password: 'password',
    });

    const res = await agent.post('/api/users/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('logout successful');
  });
});

describe('GET /api/auth/check-session', () => {
  const agent = request.agent(app);

  it('should return 200 "Session active" when user is logged in', async () => {
    // login first
    await agent.post('/api/users/login').send({
      email: 'testEmail_testingRoutes@example.com',
      password: 'password',
    });

    // then check session
    const res = await agent.get('/api/auth/check-session');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Session active');
  });

  it('should return 401 "Session expired" when user is not logged in', async () => {
    // logout first
    await agent.post('/api/users/logout');

    // then check session
    const res = await agent.get('/api/auth/check-session');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Session expired');
  });
});

describe('DELETE /api/users/delete-account', () => {
  const agent = request.agent(app);

  it('should handle letting the user delete their own account', async () => {
    // login first
    await agent.post('/api/users/login').send({
      email: 'testEmail_testingRoutes@example.com',
      password: 'password',
    });

    // now delete account
    const res = await agent.delete('/api/users/delete-account');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('User account deleted successfully');
  });

  it('should return 401 Unauthorized when checking session after account was deleted', async () => {
    const res = await agent.get('/api/auth/check-session');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Session expired');
  });
});

describe('Custom Error', () => {
  it('Should return an error with a status code', async () => {
    const res = await request(app).get('/test-custom-error');
    expect(res.status).toBe(418);
  });
});

describe('GET api/does-not-exist', () => {
  it('should return 404 Not Found', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('API endpoint not found');
  });
});

describe('GET /does-not-exist', () => {
  it('should return 404 Not Found', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  await stopServer();
});
