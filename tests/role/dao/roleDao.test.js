/* eslint-disable no-undef */
const RoleDao = require('../../../src/dao/roleDao');
const db = require('../../../src/config/sequelizeConfig');

const { Role } = db;

jest.mock('../../../src/config/sequelizeConfig', () => ({
  Role: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe('RoleDao', () => {
  describe('createRole', () => {
    it('should create a new role', async () => {
      const roleData = { role_name: 'Admin', role_desc: 'Administrator role' };
      const createdRole = { id: 1, ...roleData };
      Role.create.mockResolvedValue(createdRole);

      const result = await RoleDao.createRole(roleData);

      expect(Role.create).toHaveBeenCalledWith(roleData);
      expect(result).toEqual(createdRole);
    });
  });

  describe('getRoleById', () => {
    it('should return a role when the ID exists', async () => {
      const roleId = '1';
      const role = { id: roleId, role_name: 'Admin' };
      Role.findByPk.mockResolvedValue(role);

      const result = await RoleDao.getRoleById(roleId);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(role);
    });

    it('should return null when the role ID does not exist', async () => {
      const roleId = '999';
      Role.findByPk.mockResolvedValue(null);

      const result = await RoleDao.getRoleById(roleId);

      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(result).toBeNull();
    });
  });

  describe('getRoleByName', () => {
    it('should return a role when the name exists', async () => {
      const roleName = 'Admin';
      const role = { id: 1, role_name: roleName };
      Role.findOne.mockResolvedValue(role);

      const result = await RoleDao.getRoleByName(roleName);

      expect(Role.findOne).toHaveBeenCalledWith({ where: { role_name: roleName } });
      expect(result).toEqual(role);
    });

    it('should return null when the role name does not exist', async () => {
      const roleName = 'NonExistingRole';
      Role.findOne.mockResolvedValue(null);

      const result = await RoleDao.getRoleByName(roleName);

      expect(Role.findOne).toHaveBeenCalledWith({ where: { role_name: roleName } });
      expect(result).toBeNull();
    });
  });

  describe('updateRole', () => {
    it('should update a role and return the updated role', async () => {
      const roleId = '1';
      const updateData = { role_name: 'Updated Admin' };
      const updatedRole = { id: roleId, ...updateData };
      Role.update.mockResolvedValue([1]);
      Role.findByPk.mockResolvedValue(updatedRole);

      const result = await RoleDao.updateRole(roleId, updateData);

      expect(Role.update).toHaveBeenCalledWith(updateData, { where: { id: roleId } });
      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(updatedRole);
    });

    it('should return null when the role does not exist', async () => {
      const roleId = '999';
      const updateData = { role_name: 'NonExistentRole' };

      Role.update.mockResolvedValue([0]);
      Role.findByPk.mockResolvedValue(null);

      const result = await RoleDao.updateRole(roleId, updateData);

      expect(Role.update).toHaveBeenCalledWith(updateData, { where: { id: roleId } });
      expect(Role.findByPk).toHaveBeenCalledWith(roleId);
      expect(result).toBeNull();
    });
  });

  describe('deleteRole', () => {
    it('should delete a role and return the number of affected rows', async () => {
      const roleId = '1';
      Role.destroy.mockResolvedValue(1);

      const result = await RoleDao.deleteRole(roleId);

      expect(Role.destroy).toHaveBeenCalledWith({ where: { id: roleId } });
      expect(result).toBe(1);
    });

    it('should return 0 when the role does not exist', async () => {
      const roleId = '999';
      Role.destroy.mockResolvedValue(0);

      const result = await RoleDao.deleteRole(roleId);

      expect(Role.destroy).toHaveBeenCalledWith({ where: { id: roleId } });
      expect(result).toBe(0);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles ordered by creation date', async () => {
      const roles = [
        { id: 1, role_name: 'Admin', created_at: '2023-01-01' },
        { id: 2, role_name: 'User', created_at: '2023-01-02' },
      ];
      Role.findAll.mockResolvedValue(roles);

      const result = await RoleDao.getAllRoles();

      expect(Role.findAll).toHaveBeenCalledWith({ order: [['created_at', 'DESC']] });
      expect(result).toEqual(roles);
    });
  });
});
