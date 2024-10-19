/* eslint-disable no-undef */
const UserDao = require('../../../src/dao/userDao');
const db = require('../../../src/config/sequelizeConfig');

const { User, Role } = db;

jest.mock('../../../src/config/sequelizeConfig', () => ({
  User: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
  },
  Role: {},
}));

describe('UserDao', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { email_id: 'test@example.com', password: 'password123' };
      const createdUser = { id: 1, ...userData };
      User.create.mockResolvedValue(createdUser);

      const result = await UserDao.createUser(userData);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user with role when the ID exists', async () => {
      const userId = 1;
      const user = { id: userId, email_id: 'test@example.com', role: { id: 2, role_name: 'Admin' } };
      User.findByPk.mockResolvedValue(user);

      const result = await UserDao.getUserById(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        include: [{ model: Role, as: 'role' }],
      });
      expect(result).toEqual(user);
    });

    it('should return null when the user ID does not exist', async () => {
      const userId = 999;
      User.findByPk.mockResolvedValue(null);

      const result = await UserDao.getUserById(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        include: [{ model: Role, as: 'role' }],
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user with role when the email exists', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email_id: email, role: { id: 2, role_name: 'Admin' } };
      User.findOne.mockResolvedValue(user);

      const result = await UserDao.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email_id: email },
        include: [{ model: Role, as: 'role' }],
      });
      expect(result).toEqual(user);
    });

    it('should return null when the email does not exist', async () => {
      const email = 'nonexistent@example.com';
      User.findOne.mockResolvedValue(null);

      const result = await UserDao.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email_id: email },
        include: [{ model: Role, as: 'role' }],
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const userId = 1;
      const updateData = { email_id: 'updated@example.com' };
      const updatedUser = { id: userId, ...updateData, role: { id: 2, role_name: 'Admin' } };

      User.update.mockResolvedValue([1]);
      User.findByPk.mockResolvedValue(updatedUser);

      const result = await UserDao.updateUser(userId, updateData);

      expect(User.update).toHaveBeenCalledWith(updateData, { where: { id: userId } });
      expect(User.findByPk).toHaveBeenCalledWith(userId, { include: [{ model: Role, as: 'role' }] });
      expect(result).toEqual(updatedUser);
    });

    it('should return null when the user does not exist', async () => {
      const userId = 999;
      const updateData = { email_id: 'updated@example.com' };

      User.update.mockResolvedValue([0]);
      User.findByPk.mockResolvedValue(null);

      const result = await UserDao.updateUser(userId, updateData);

      expect(User.update).toHaveBeenCalledWith(updateData, { where: { id: userId } });
      expect(User.findByPk).toHaveBeenCalledWith(userId, { include: [{ model: Role, as: 'role' }] });
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the number of affected rows', async () => {
      const userId = 1;
      User.destroy.mockResolvedValue(1);

      const result = await UserDao.deleteUser(userId);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBe(1);
    });

    it('should return 0 when the user does not exist', async () => {
      const userId = 999;
      User.destroy.mockResolvedValue(0);

      const result = await UserDao.deleteUser(userId);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toBe(0);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users with role included', async () => {
      const page = 1;
      const limit = 2;
      const users = {
        count: 2,
        rows: [
          { id: 1, email_id: 'user1@example.com', role: { id: 2, role_name: 'Admin' } },
          { id: 2, email_id: 'user2@example.com', role: { id: 2, role_name: 'User' } },
        ],
      };
      User.findAndCountAll.mockResolvedValue(users);

      const result = await UserDao.getAllUsers(page, limit);

      expect(User.findAndCountAll).toHaveBeenCalledWith({
        include: [{ model: Role, as: 'role' }],
        limit,
        offset: 0,
        order: [['created_at', 'DESC']],
      });
      expect(result).toEqual(users);
    });
  });
});
