/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const express = require('express');
const loginValidation = require('../../src/middlewares/validation/loginValidation');

const userController = {
  loginUser: jest.fn((req, res) => res.status(200).json({ message: 'Login successful' })),
};

const app = express();
app.use(express.json());
app.post('/loginSME', loginValidation, userController.loginUser);

describe('POST /loginSME', () => {
  test('should return 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'invalid-email',
        mobile: '1234567890',
        role: 2,
        app: 1,
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors.email).toBe('Email is invalid');
  });

  test('should return 422 when mobile number is invalid', async () => {
    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: 'invalid-mobile',
        role: 2,
        app: 1,
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('mobile');
    expect(res.body.errors.mobile).toBe('Mobile number is invalid');
  });

  test('should return 422 when role is not a valid integer', async () => {
    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: '1234567890',
        role: 'not-an-int',
        app: 1,
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('role');
    expect(res.body.errors.role).toBe('Role must be a valid integer');
  });

  test('should return 422 when app is not a valid integer', async () => {
    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: '1234567890',
        role: 2,
        app: 'not-an-int',
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('app');
    expect(res.body.errors.app).toBe('App must be a valid integer');
  });

  test('should return 200 for valid input', async () => {
    const res = await request(app)
      .post('/loginSME')
      .send({
        email: 'test@example.com',
        mobile: '1234567890',
        role: 2,
        app: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
  });
});
