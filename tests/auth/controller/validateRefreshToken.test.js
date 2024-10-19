/* eslint-disable no-undef */
// __tests__/validateRefreshToken.test.js

const request = require('supertest');
const express = require('express');
const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');
const errorHandler = require('../../../src/middlewares/errorHandler');
const { UnauthorizedError, NotFoundError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.post('/refreshToken', authController.validateRefreshToken);
app.use(errorHandler);

jest.mock('../../../src/services/authService');
jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('POST /refreshToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and new tokens when refresh token is valid', async () => {
    const refreshToken = 'validRefreshToken';

    authService.refreshTokens.mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      accessTokenExpiration: 3600,
      refreshTokenExpiration: 7200,
    });

    const response = await request(app).post('/refreshToken').send({ refresh_token: refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Tokens refreshed successfully');
    expect(response.body.data).toHaveProperty('accessToken', 'newAccessToken');
    expect(response.body.data).toHaveProperty('refreshToken', 'newRefreshToken');
    expect(authService.refreshTokens).toHaveBeenCalledWith(expect.anything(), refreshToken);
  });

  it('should return 401 when refresh token is missing', async () => {
    authService.refreshTokens.mockRejectedValue(new UnauthorizedError('Refresh token is required'));

    const response = await request(app).post('/refreshToken').send({});

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Refresh token is required');
  });

  it('should return 401 when refresh token is invalid', async () => {
    const refreshToken = 'invalidRefreshToken';

    authService.refreshTokens.mockRejectedValue(new UnauthorizedError('Invalid or expired refresh token'));

    const response = await request(app).post('/refreshToken').send({ refresh_token: refreshToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid or expired refresh token');
  });

  it('should return 404 when user is not found', async () => {
    const refreshToken = 'validRefreshToken';

    authService.refreshTokens.mockRejectedValue(new NotFoundError('User not found'));

    const response = await request(app).post('/refreshToken').send({ refresh_token: refreshToken });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
