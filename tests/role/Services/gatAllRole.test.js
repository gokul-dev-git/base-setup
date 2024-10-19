/* eslint-disable no-undef */
const roleDao = require('../../../src/dao/roleDao');
const roleService = require('../../../src/services/roleService');

jest.mock('../../../src/dao/roleDao');

describe('Role Service - getAllRoles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of roles successfully', async () => {
    const rolesMock = [
      { id: 1, role_name: 'Admin', created_at: '2023-01-01' },
      { id: 2, role_name: 'User', created_at: '2023-01-02' },
    ];

    roleDao.getAllRoles.mockResolvedValue(rolesMock);

    const result = await roleService.getAllRoles();

    expect(result).toEqual(rolesMock);
    expect(roleDao.getAllRoles).toHaveBeenCalled();
  });

  it('should throw an error when the DAO call fails', async () => {
    const errorMessage = 'Database error';

    roleDao.getAllRoles.mockRejectedValue(new Error(errorMessage));

    await expect(roleService.getAllRoles()).rejects.toThrow(errorMessage);
    expect(roleDao.getAllRoles).toHaveBeenCalled();
  });
});
