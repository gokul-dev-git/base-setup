/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const roleController = require('../../../src/controllers/roleController');
const roleService = require('../../../src/services/roleService');
const authenticate = require('../../../src/middlewares/authMiddleware');
const errorHandler = require('../../../src/middlewares/errorHandler');
const { NotFoundError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.get('/role/:id', authenticate, roleController.getRoleById);
app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/roleService');
jest.mock('../../../src/middlewares/authMiddleware');

describe('GET /role/:id', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the role when a valid ID is provided', async () => {
    const roleMock = { id: 1, role_name: 'Admin', role_desc: 'Administrator role' };
    const roleId = '1';

    roleService.getRoleById.mockResolvedValue(roleMock);

    const response = await request(app).get(`/role/${roleId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Record Retrieved Successfully');
    expect(response.body.data).toEqual(roleMock);
    expect(roleService.getRoleById).toHaveBeenCalledWith(roleId);
  });

  it('should return 404 when the role does not exist', async () => {
    const roleId = '999';

    const error = new NotFoundError('Role not found');

    roleService.getRoleById.mockRejectedValue(error);

    const response = await request(app).get(`/role/${roleId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Role not found');
    expect(roleService.getRoleById).toHaveBeenCalledWith(roleId);
  });
});
