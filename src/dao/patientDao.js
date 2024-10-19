/* eslint-disable class-methods-use-this */
const db = require('../config/sequelizeConfig');

const { Patient, User } = db;

class PatientDao {
  async createPatient(patientData) {
    const patient = await Patient.create(patientData);
    return patient;
  }

  async getPatientById(id) {
    const patient = await Patient.findByPk(id, {
      include: [{ model: User, as: 'user' }],
    });
    return patient;
  }

  async getAllPatients() {
    const patients = await Patient.findAll({
      include: [{ model: User, as: 'user' }],
    });
    return patients;
  }

  async updatePatient(id, patientData) {
    await Patient.update(patientData, {
      where: { id },
    });
    return this.getPatientById(id);
  }

  async deletePatient(id) {
    await Patient.destroy({
      where: { id },
    });
    return true;
  }
}

module.exports = new PatientDao();
