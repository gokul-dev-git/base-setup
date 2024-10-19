/* eslint-disable no-undef */
const roleDao = require('../../../src/dao/roleDao');
const roleService = require('../../../src/services/roleService');
const { NotFoundError } = require('../../../src/middlewares/errorHandler');

jest.mock('../../../src/dao/roleDao');

describe('Role Service - deleteRole', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a role', async () => {
    const roleId = 1;

    roleDao.getRoleById.mockResolvedValue({ id: roleId, role_name: 'Test Role' });

    roleDao.deleteRole.mockResolvedValue(1);

    const result = await roleService.deleteRole(roleId);

    expect(result).toEqual({ message: 'Role deleted successfully' });
    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.deleteRole).toHaveBeenCalledWith(roleId);
  });

  it('should throw NotFoundError if the role does not exist', async () => {
    const roleId = 2;

    roleDao.getRoleById.mockResolvedValue(null);

    await expect(roleService.deleteRole(roleId))
      .rejects
      .toThrow(NotFoundError);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.deleteRole).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during the deletion process', async () => {
    const roleId = 3;
    const errorMessage = 'Database error';

    roleDao.getRoleById.mockResolvedValue({ id: roleId, role_name: 'Test Role' });

    roleDao.deleteRole.mockRejectedValue(new Error(errorMessage));

    await expect(roleService.deleteRole(roleId))
      .rejects
      .toThrow(errorMessage);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
    expect(roleDao.deleteRole).toHaveBeenCalledWith(roleId);
  });
});
