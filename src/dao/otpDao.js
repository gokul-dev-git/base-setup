/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
const { Op } = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');
const db = require('../config/sequelizeConfig');
const { OTP_EXPIRATION_TIME } = require('../config/appConfig');

const { Otp } = db;

class OtpDao {
  async saveOtp(otpData) {
    return await Otp.create(otpData);
  }

  async findOtp(userId, otpCode, deliveryType) {
    return await Otp.findOne({
      where: {
        user_id: userId,
        otp_code: otpCode,
        delivery_type: deliveryType,
      },
    });
  }

  async isOtpValid(userId, otpCode, deliveryType) {
    const expirationTimeInMinutes = parseInt(OTP_EXPIRATION_TIME, 10) || 5;
    const expirationTime = moment().subtract(expirationTimeInMinutes, 'minutes').toDate();

    const otpRecord = await Otp.findOne({
      where: {
        user_id: userId,
        otp_code: otpCode,
        delivery_type: deliveryType,
        created_at: {
          [Op.gt]: expirationTime,
        },
      },
    });

    return otpRecord !== null;
  }

  async deleteOtp(otpId) {
    return await Otp.destroy({
      where: { id: otpId },
    });
  }

  async deleteOtpByUserID(userID) {
    return await Otp.destroy({
      where: { user_id: userID },
    });
  }

  async deleteExpiredOtps() {
    const expirationTimeInMinutes = parseInt(OTP_EXPIRATION_TIME, 10) || 5;
    const expirationTime = new Date(Date.now() - expirationTimeInMinutes * 60 * 1000);
    return await Otp.destroy({
      where: {
        created_at: {
          [Op.lt]: expirationTime,
        },
      },
    });
  }
}

module.exports = new OtpDao();
