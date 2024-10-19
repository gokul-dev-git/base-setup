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
app.delete('/role/:id', authenticate, roleController.deleteRole);
app.use(errorHandler);

jest.mock('../../../src/middlewares/logger');
jest.mock('../../../src/services/roleService');
jest.mock('../../../src/middlewares/authMiddleware');

describe('DELETE /role/:id', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 204 when a role is successfully deleted', async () => {
    const roleId = '1';

    roleService.deleteRole.mockResolvedValue({ message: 'Role deleted successfully' });

    const response = await request(app).delete(`/role/${roleId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
  });

  it('should return 404 when the role does not exist', async () => {
    const roleId = '999';

    roleService.deleteRole.mockImplementation(() => {
      throw new NotFoundError('Role not found');
    });

    const response = await request(app).delete(`/role/${roleId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Role not found');
    expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
  });
});
