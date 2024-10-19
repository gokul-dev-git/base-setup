/* eslint-disable consistent-return */
const roleService = require('../services/roleService');

const getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    return res.status(200).json({ message: 'Record Retrieved Successfully', data: role });
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    return res.status(200).json({ message: 'Records Retrieved Successfully', data: roles });
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    return res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    return res.status(200).json({ message: 'Record Updated Successfully', role });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRole(req.params.id);
    return res.status(204).json({ message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoleById,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
