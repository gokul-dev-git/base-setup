/* eslint-disable no-undef */
const roleDao = require('../../../src/dao/roleDao');
const roleService = require('../../../src/services/roleService');
const { BadRequestError } = require('../../../src/utils/errorHandler');

jest.mock('../../../src/dao/roleDao');

describe('Role Service - createRole', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new role when it does not exist', async () => {
    const newRoleData = { role_name: 'Admin', role_desc: 'Administrator role' };
    const createdRole = { id: 1, ...newRoleData };

    roleDao.getRoleByName.mockResolvedValue(null);
    roleDao.createRole.mockResolvedValue(createdRole);

    const result = await roleService.createRole(newRoleData);

    expect(result).toEqual(createdRole);
    expect(roleDao.getRoleByName).toHaveBeenCalledWith(newRoleData.role_name);
    expect(roleDao.createRole).toHaveBeenCalledWith(newRoleData);
  });

  it('should throw an error if the role already exists', async () => {
    const existingRoleData = { role_name: 'Admin', role_desc: 'Administrator role' };
    const existingRole = { id: 1, ...existingRoleData };

    roleDao.getRoleByName.mockResolvedValue(existingRole);

    await expect(roleService.createRole(existingRoleData))
      .rejects
      .toThrow(BadRequestError);

    expect(roleDao.getRoleByName).toHaveBeenCalledWith(existingRoleData.role_name);
    expect(roleDao.createRole).not.toHaveBeenCalled();
  });

  it('should handle errors when DAO throws an unexpected error', async () => {
    const newRoleData = { role_name: 'Admin', role_desc: 'Administrator role' };
    const errorMessage = 'Database error';

    roleDao.getRoleByName.mockRejectedValue(new Error(errorMessage));

    await expect(roleService.createRole(newRoleData))
      .rejects
      .toThrow(errorMessage);

    expect(roleDao.getRoleByName).toHaveBeenCalledWith(newRoleData.role_name);
    expect(roleDao.createRole).not.toHaveBeenCalled();
  });
});
