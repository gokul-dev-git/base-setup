/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const express = require('express');
const userController = require('../../../src/controllers/authController');
const userService = require('../../../src/services/authService');
const loginValidation = require('../../../src/middlewares/validation/loginValidation');
const errorHandler = require('../../../src/middlewares/errorHandler');
const { NotFoundError, BadRequestError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.post('/loginSME', loginValidation, userController.loginUser);

app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/authService');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('POST /loginSME', () => {
  test('should return 200 and send OTPs when user login is successful', async () => {
    const mockUserData = { id: 1, email_id: 'test@example.com', mobile_number: '1234567890' };
    userService.loginUser.mockResolvedValue({ userData: mockUserData });

    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: '1234567890',
        role: 1,
        app: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Otp Send successfully!');
    expect(res.body).toHaveProperty('userData');
    expect(res.body.userData).toEqual(mockUserData);
  });

  test('should return 404 when user is not found', async () => {
    const error = new NotFoundError('User not found');
    userService.loginUser.mockRejectedValue(error);

    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'invalid@example.com',
        mobile: '1234567890',
        role: 1,
        app: 1,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  test('should return 400 when user is inactive or invalid', async () => {
    const error = new BadRequestError('User not found or inactive');
    userService.loginUser.mockRejectedValue(error);

    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'inactive@example.com',
        mobile: '1234567890',
        role: 4,
        app: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'User not found or inactive');
  });

  test('should return 500 when an internal server error occurs', async () => {
    const error = new Error('Something went wrong!');
    error.status = 500;
    userService.loginUser.mockRejectedValue(error);

    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: '1234567890',
        role: 1,
        app: 1,
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Something went wrong!');
  });
});
