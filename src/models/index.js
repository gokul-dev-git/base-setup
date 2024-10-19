const UserModel = require('./userModel');
const RoleModel = require('./roleModel');
const OtpModel = require('./otpModel');
const PatientModel = require('./patientModel');

const initializeModels = (sequelize, Sequelize) => {
  const db = {
    User: UserModel(sequelize, Sequelize),
    Role: RoleModel(sequelize, Sequelize),
    Otp: OtpModel(sequelize, Sequelize),
    Patient: PatientModel(sequelize, Sequelize),
  };

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};

module.exports = initializeModels;
