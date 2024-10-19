/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const authController = require('../../../src/controllers/authController');
const loginVerifyValidation = require('../../../src/middlewares/validation/loginVerifyValidation');
const errorHandler = require('../../../src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.post('/validateSME', loginVerifyValidation, authController.loginValidate);
app.use(errorHandler);

jest.mock('../../../src/controllers/authController');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('POST /validateSME', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 when valid data is provided', async () => {
    const validData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    authController.loginValidate.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Validation successful' });
    });

    const response = await request(app).post('/validateSME').send(validData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Validation successful' });
  });

  it('should return 422 when user_id is not a valid integer', async () => {
    const invalidData = {
      user_id: 'invalid',
      email_otp: 123456,
      mobile_otp: 654321,
      app: 1,
    };

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('user_id');
    expect(response.body.errors.user_id).toBe('User ID must be a valid integer');
  });

  it('should return 422 when email_otp is not a valid 6-digit number', async () => {
    const invalidData = {
      user_id: 1,
      email_otp: 12345,
      mobile_otp: 654321,
      app: 1,
    };

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('email_otp');
    expect(response.body.errors.email_otp).toBe('Email OTP must be a 6-digit number');
  });

  it('should return 422 when mobile_otp is not a valid 6-digit number', async () => {
    const invalidData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 12345,
      app: 1,
    };

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('mobile_otp');
    expect(response.body.errors.mobile_otp).toBe('Mobile OTP must be a 6-digit number');
  });

  it('should return 422 when app is not a valid integer', async () => {
    const invalidData = {
      user_id: 1,
      email_otp: 123456,
      mobile_otp: 654321,
      app: 'invalid',
    };

    const response = await request(app).post('/validateSME').send(invalidData);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('app');
    expect(response.body.errors.app).toBe('App must be a valid integer');
  });
});
