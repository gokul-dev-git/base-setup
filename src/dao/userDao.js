/* eslint-disable class-methods-use-this */
const db = require('../config/sequelizeConfig');

const { User, Role } = db;

class UserDao {
  async createUser(userData) {
    return User.create(userData);
  }

  async getUserById(id) {
    return User.findByPk(id, {
      include: [{ model: Role, as: 'role' }],
    });
  }

  async getUserByEmail(email) {
    return User.findOne({
      where: { email_id: email },
      include: [{ model: Role, as: 'role' }],
    });
  }

  async updateUser(id, updateData) {
    await User.update(updateData, { where: { id } });
    return this.getUserById(id);
  }

  async deleteUser(id) {
    return User.destroy({ where: { id } });
  }

  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return User.findAndCountAll({
      include: [{ model: Role, as: 'role' }],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }
}

module.exports = new UserDao();
