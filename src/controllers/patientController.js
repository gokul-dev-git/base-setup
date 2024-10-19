/* eslint-disable consistent-return */
const patientService = require('../services/patientService');

const fetchAllPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getAllPatients();
    return res.json({ message: 'Patients retrieved successfully!', patients });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchAllPatients,
};
