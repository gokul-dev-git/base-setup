/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const authController = require('../../../src/controllers/authController');
const authenticate = require('../../../src/middlewares/authMiddleware');
const errorHandler = require('../../../src/middlewares/errorHandler');
const { UnauthorizedError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.get('/testAuth', authenticate, authController.testAuth);
app.use(errorHandler);

jest.mock('../../../src/middlewares/authMiddleware');
jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('GET /testAuth', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and success message when user is authorized', async () => {
    const response = await request(app).get('/testAuth');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Your authorized');
  });

  it('should return 401 when user is not authorized', async () => {
    authenticate.mockImplementation((req, res, next) => {
      const error = new UnauthorizedError('Unauthorized');
      next(error);
    });

    const response = await request(app).get('/testAuth');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});
