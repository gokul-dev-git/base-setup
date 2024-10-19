/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const roleController = require('../../../src/controllers/roleController');
const roleService = require('../../../src/services/roleService');
const authenticate = require('../../../src/middlewares/authMiddleware');
const errorHandler = require('../../../src/middlewares/errorHandler');
const roleValidation = require('../../../src/middlewares/validation/roleValidation');
const { BadRequestError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.post('/role', authenticate, roleValidation, roleController.createRole);
app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/roleService');
jest.mock('../../../src/middlewares/authMiddleware');

describe('POST /role', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a role when valid data is provided', async () => {
    const roleData = {
      role_name: 'Admin',
      role_desc: 'Administrator role',
    };

    roleService.createRole.mockResolvedValue(roleData);

    const response = await request(app).post('/role').send(roleData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(roleData);
    expect(roleService.createRole).toHaveBeenCalledWith(roleData);
  });

  it('should return 400 when the role already exists', async () => {
    const roleData = {
      role_name: 'Admin',
      role_desc: 'Administrator role',
    };

    const error = new BadRequestError('Role already exists');

    roleService.createRole.mockRejectedValue(error);

    const response = await request(app).post('/role').send(roleData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Role already exists');
    expect(roleService.createRole).toHaveBeenCalledWith(roleData);
  });
});
