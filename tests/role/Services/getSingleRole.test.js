/* eslint-disable no-undef */

const roleDao = require('../../../src/dao/roleDao');
const roleService = require('../../../src/services/roleService');
const { NotFoundError } = require('../../../src/utils/errorHandler');

jest.mock('../../../src/dao/roleDao');

describe('Role Service - getRoleById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve a role by ID', async () => {
    const roleId = 1;
    const roleMock = { id: roleId, role_name: 'Admin', role_desc: 'Administrator role' };

    roleDao.getRoleById.mockResolvedValue(roleMock);

    const result = await roleService.getRoleById(roleId);

    expect(result).toEqual(roleMock);
    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
  });

  it('should throw NotFoundError if role is not found', async () => {
    const roleId = 2;

    roleDao.getRoleById.mockResolvedValue(null);

    await expect(roleService.getRoleById(roleId))
      .rejects
      .toThrow(NotFoundError);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
  });

  it('should handle unexpected errors during role retrieval', async () => {
    const roleId = 3;
    const errorMessage = 'Database error';

    roleDao.getRoleById.mockRejectedValue(new Error(errorMessage));

    await expect(roleService.getRoleById(roleId))
      .rejects
      .toThrow(errorMessage);

    expect(roleDao.getRoleById).toHaveBeenCalledWith(roleId);
  });
});
