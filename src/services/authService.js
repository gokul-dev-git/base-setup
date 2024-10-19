/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');
const userDao = require('../dao/userDao');
const utils = require('../utils/utils');
const otpDao = require('../dao/otpDao');
const { NotFoundError, BadRequestError } = require('../utils/errorHandler');
const communicationService = require('./communicationService');

// eslint-disable-next-line no-unused-vars
const loginUser = async (email, mobile, role, app) => {
  const user = await userDao.getUserByEmail(email);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userData = user.toJSON();

  if (userData.mobile_number !== mobile || userData.role.id !== role) {
    throw new NotFoundError('User not found');
  }

  if (!userData.is_active || (role === 4 && (!userData.mobile_number || !userData.email_id))) {
    throw new BadRequestError('User not found or inactive');
  }

  const emailOtp = utils.generateOtp();
  const mobileOtp = utils.generateOtp();

  await otpDao.deleteOtpByUserID(userData.id);

  await otpDao.saveOtp({
    user_id: userData.id,
    otp_code: emailOtp,
    delivery_type: 'email',
    app: 1,
  });

  await otpDao.saveOtp({
    user_id: userData.id,
    otp_code: mobileOtp,
    delivery_type: 'sms',
    app: 1,
  });

  await communicationService.sendEmailOtp(userData.email_id, emailOtp);
  await communicationService.sendSmsOtp(userData.mobile_number, mobileOtp);

  return { userData };
};

// eslint-disable-next-line no-unused-vars
const loginValidate = async (userId, emailOtp, mobileOtp, app) => {
  const user = await userDao.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const emailOtpValid = await otpDao.isOtpValid(userId, emailOtp, 'email');
  const mobileOtpValid = await otpDao.isOtpValid(userId, mobileOtp, 'sms');

  if (!emailOtpValid) {
    throw new BadRequestError('Email OTP is either invalid or expired');
  }

  if (!mobileOtpValid) {
    throw new BadRequestError('Mobile OTP is either invalid or expired');
  }

  const sessionID = uuidv4();

  // eslint-disable-next-line max-len
  const { token: accessToken, expiresIn: accessTokenExpiration } = utils.createAccessToken(user, sessionID);
  // eslint-disable-next-line max-len
  const { token: refreshToken, expiresIn: refreshTokenExpiration } = utils.createRefreshToken(userId, sessionID);

  await otpDao.deleteOtpByUserID(userId);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiration,
    refreshTokenExpiration,
    user,
  };
};

const refreshTokens = async (req, refreshToken) => {
  const { userId, sessionID } = utils.validateRefreshToken(refreshToken);

  // Retrieve user details
  const user = await userDao.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  req.sessionID = sessionID;
  // eslint-disable-next-line max-len
  const { token: accessToken, expiresIn: accessTokenExpiration } = utils.createAccessToken(user, sessionID);

  // eslint-disable-next-line max-len
  const { token: newRefreshToken, expiresIn: refreshTokenExpiration } = utils.createRefreshToken(userId, sessionID);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenExpiration,
    refreshTokenExpiration,
  };
};

module.exports = {
  loginUser,
  loginValidate,
  refreshTokens,
};
