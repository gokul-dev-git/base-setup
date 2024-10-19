/* eslint-disable consistent-return */
const userService = require('../services/authService');

const loginUser = async (req, res, next) => {
  try {
    const {
      email, mobile, role, app,
    } = req.body;

    const { userData } = await userService.loginUser(email, mobile, role, app);
    return res.status(200).json({ message: 'Otp Send successfully!', userData });
  } catch (error) {
    next(error);
  }
};

const loginValidate = async (req, res, next) => {
  try {
    const {
      // eslint-disable-next-line camelcase
      user_id, email_otp, mobile_otp, app,
    } = req.body;

    const result = await userService.loginValidate(user_id, email_otp, mobile_otp, app);

    return res.status(200).json({
      message: 'OTP verification successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line no-unused-vars
const testAuth = async (req, res, next) => res.status(200).json({
  message: 'Your authorized',
});

const validateRefreshToken = async (req, res, next) => {
  try {
    // eslint-disable-next-line camelcase
    const { refresh_token } = req.body;
    const result = await userService.refreshTokens(req, refresh_token);

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  loginValidate,
  testAuth,
  validateRefreshToken,
};
