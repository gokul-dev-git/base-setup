/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const roleController = require('../../../src/controllers/roleController');
const roleService = require('../../../src/services/roleService');
const authenticate = require('../../../src/middlewares/authMiddleware');
const errorHandler = require('../../../src/middlewares/errorHandler');
const roleValidation = require('../../../src/middlewares/validation/roleValidation');
const { NotFoundError, BadRequestError } = require('../../../src/utils/errorHandler');

const app = express();
app.use(express.json());
app.patch('/role/:id', authenticate, roleValidation, roleController.updateRole);
app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/roleService');
jest.mock('../../../src/middlewares/authMiddleware');

describe('PATCH /role/:id', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the updated role when valid data is provided', async () => {
    const roleId = '1';
    const roleUpdateData = {
      role_name: 'Updated Admin',
      role_desc: 'Updated description',
    };

    const updatedRole = { id: roleId, ...roleUpdateData };

    roleService.updateRole.mockResolvedValue(updatedRole);

    const response = await request(app).patch(`/role/${roleId}`).send(roleUpdateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Record Updated Successfully');
    expect(response.body.role).toEqual(updatedRole);
    expect(roleService.updateRole).toHaveBeenCalledWith(roleId, roleUpdateData);
  });

  it('should return 404 when the role does not exist', async () => {
    const roleId = '999';
    const roleUpdateData = {
      role_name: 'Updated Admin',
    };

    roleService.updateRole.mockImplementation(() => {
      throw new NotFoundError('Role not found');
    });

    const response = await request(app).patch(`/role/${roleId}`).send(roleUpdateData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Role not found');
    expect(roleService.updateRole).toHaveBeenCalledWith(roleId, roleUpdateData);
  });

  it('should return 400 when the role already exists', async () => {
    const roleId = '1';
    const roleUpdateData = {
      role_name: 'Existing Role',
    };

    roleService.updateRole.mockImplementation(() => {
      throw new BadRequestError('Role already exists');
    });

    const response = await request(app).patch(`/role/${roleId}`).send(roleUpdateData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Role already exists');
    expect(roleService.updateRole).toHaveBeenCalledWith(roleId, roleUpdateData);
  });
});
