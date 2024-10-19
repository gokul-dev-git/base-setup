/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');
const errorHandler = require('../../../src/middlewares/errorHandler');
const { NotFoundError, BadRequestError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.post('/validateSME', authController.loginValidate);
app.use(errorHandler);

jest.mock('../../../src/services/authService');
jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('POST /validateSME', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the user data when OTP verification is successful', async () => {
    const validData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    const mockUserData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    authService.loginValidate.mockResolvedValue({
      accessToken: 'someAccessToken',
      refreshToken: 'someRefreshToken',
      accessTokenExpiration: 3600,
      refreshTokenExpiration: 7200,
      user: mockUserData,
    });

    const response = await request(app).post('/validateSME').send(validData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OTP verification successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    expect(response.body.data.user).toEqual(mockUserData);
    expect(authService.loginValidate).toHaveBeenCalledWith(1, 123456, 654321, 1);
  });

  it('should return 404 when user is not found', async () => {
    const invalidData = {
      user_id: 999,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    authService.loginValidate.mockRejectedValue(new NotFoundError('User not found'));

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should return 400 when email OTP is invalid', async () => {
    const invalidData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    authService.loginValidate.mockRejectedValue(new BadRequestError('Email OTP is either invalid or expired'));

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email OTP is either invalid or expired');
  });

  it('should return 400 when mobile OTP is invalid', async () => {
    const invalidData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    authService.loginValidate.mockRejectedValue(new BadRequestError('Mobile OTP is either invalid or expired'));

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Mobile OTP is either invalid or expired');
  });
});
