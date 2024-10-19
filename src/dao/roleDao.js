/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
const db = require('../config/sequelizeConfig');

const { Role } = db;

class RoleDao {
  async createRole(roleData) {
    return await Role.create(roleData);
  }

  async getRoleById(id) {
    return await Role.findByPk(id);
  }

  async getRoleByName(name) {
    return await Role.findOne({ where: { role_name: name } });
  }

  async updateRole(id, updateData) {
    await Role.update(updateData, { where: { id } });
    return await this.getRoleById(id);
  }

  async deleteRole(id) {
    return await Role.destroy({ where: { id } });
  }

  async getAllRoles() {
    return await Role.findAll({
      order: [['created_at', 'DESC']],
    });
  }
}

module.exports = new RoleDao();
