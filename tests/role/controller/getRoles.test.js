/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const roleController = require('../../../src/controllers/roleController');
const roleService = require('../../../src/services/roleService');
const authenticate = require('../../../src/middlewares/authMiddleware');
const errorHandler = require('../../../src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.get('/role', authenticate, roleController.getAllRoles);

app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/roleService');
jest.mock('../../../src/middlewares/authMiddleware');

describe('GET /role', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and roles data when successful', async () => {
    const rolesMock = [
      { id: 1, name: 'Admin', created_at: '2023-01-01' },
      { id: 2, name: 'User', created_at: '2023-01-02' },
    ];

    roleService.getAllRoles.mockResolvedValue(rolesMock);

    const response = await request(app).get('/role');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Records Retrieved Successfully');
    expect(response.body.data).toEqual(rolesMock);
    expect(roleService.getAllRoles).toHaveBeenCalled();
  });

  it('should return 500 and an error message when service fails', async () => {
    const error = new Error('Something went wrong!');
    error.status = 500;
    roleService.getAllRoles.mockRejectedValue(error);

    const response = await request(app).get('/role');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Something went wrong!');
    expect(roleService.getAllRoles).toHaveBeenCalled();
  });
});
