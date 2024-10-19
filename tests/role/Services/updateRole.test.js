/* eslint-disable no-undef */
const roleDao = require('../../../src/dao/roleDao');
const roleService = require('../../../src/services/roleService');
const { NotFoundError, BadRequestError } = require('../../../src/middlewares/errorHandler');

jest.mock('../../../src/dao/roleDao');

describe('Role Service - updateRole', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a role', async () => {
    const roleId = 1;
    const updateData = { role_name: 'New Role', role_desc: 'Updated description' };
    const updatedRole = { id: roleId, ...updateData };

    roleDao.getRoleById.mockResolvedValue({ id: roleId, role_name: 'Old Role' });
    roleDao.getRoleByName.mockResolvedValue(null);
    roleDao.updateRole.mockResolvedValue(updatedRole);

    const result = await roleService.updateRole(roleId, updateData);

    expect(result).toEqual(updatedRole);
    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.getRoleByName).toHaveBeenCalledWith(updateData.role_name);
    expect(roleDao.updateRole).toHaveBeenCalledWith(roleId, updateData);
  });

  it('should throw NotFoundError if the role does not exist', async () => {
    const roleId = 2;
    const updateData = { role_name: 'Non-existent Role' };

    roleDao.getRoleById.mockResolvedValue(null);

    await expect(roleService.updateRole(roleId, updateData))
      .rejects
      .toThrow(NotFoundError);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.updateRole).not.toHaveBeenCalled();
  });

  it('should throw BadRequestError if a role with the same name already exists', async () => {
    const roleId = 3;
    const updateData = { role_name: 'Duplicate Role' };
    const existingRole = { id: 4, role_name: 'Duplicate Role' };

    roleDao.getRoleById.mockResolvedValue({ id: roleId, role_name: 'Old Role' });
    roleDao.getRoleByName.mockResolvedValue(existingRole);

    await expect(roleService.updateRole(roleId, updateData))
      .rejects
      .toThrow(BadRequestError);

    expect(roleDao.getRoleByName).toHaveBeenCalledWith(updateData.role_name);
    expect(roleDao.updateRole).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during update', async () => {
    const roleId = 5;
    const updateData = { role_name: 'Error Role' };
    const errorMessage = 'Database error';

    roleDao.getRoleById.mockResolvedValue({ id: roleId, role_name: 'Old Role' });
    roleDao.getRoleByName.mockResolvedValue(null);
    roleDao.updateRole.mockRejectedValue(new Error(errorMessage));

    await expect(roleService.updateRole(roleId, updateData))
      .rejects
      .toThrow(errorMessage);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.updateRole).toHaveBeenCalledWith(roleId, updateData);
  });
});
