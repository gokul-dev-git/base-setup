/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
const roleDao = require('../dao/roleDao');
const { NotFoundError, BadRequestError } = require('../utils/errorHandler');

const getRoleById = async (id) => {
  const role = await roleDao.getRoleById(id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
};

const getAllRoles = async () => {
  return await roleDao.getAllRoles();
};

const createRole = async (roleData) => {
  const existingRole = await roleDao.getRoleByName(roleData.role_name);
  if (existingRole) {
    throw new BadRequestError('Role already exists');
  }

  return await roleDao.createRole(roleData);
};

const updateRole = async (id, updateData) => {
  const role = await getRoleById(id);

  if (updateData.role_name) {
    const existingRole = await roleDao.getRoleByName(updateData.role_name);
    // eslint-disable-next-line eqeqeq
    if (existingRole && existingRole.id != id) {
      throw new BadRequestError('Role already exists');
    }
  }

  return await roleDao.updateRole(role.id, updateData);
};

const deleteRole = async (id) => {
  const role = await getRoleById(id);
  await roleDao.deleteRole(role.id);
  return { message: 'Role deleted successfully' };
};

module.exports = {
  getRoleById,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
