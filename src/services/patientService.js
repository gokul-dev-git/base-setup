const patientDao = require('../dao/patientDao');

const getAllPatients = () => patientDao.getAllPatients();

module.exports = {
  getAllPatients,
};
