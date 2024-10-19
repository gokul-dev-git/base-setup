/* eslint-disable max-len */
/* eslint-disable no-undef */
const userService = require('../../../src/services/authService');
const userDao = require('../../../src/dao/userDao');
const otpDao = require('../../../src/dao/otpDao');
const utils = require('../../../src/utils/utils');
const { BadRequestError, NotFoundError } = require('../../../src/middlewares/errorHandler');

jest.mock('../../../src/dao/userDao');
jest.mock('../../../src/dao/otpDao');
jest.mock('../../../src/utils/utils');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('User Service', () => {
  describe('loginValidate', () => {
    const userId = 1;
    const emailOtp = '123456';
    const mobileOtp = '654321';
    const app = 1;
    const user = {
      id: userId,
      email_id: 'test@example.com',
      mobile_number: '1234567890',
      toJSON: jest.fn().mockReturnValue({
        id: userId,
        email_id: 'test@example.com',
        mobile_number: '1234567890',
      }),
    };

    it('should return access and refresh tokens successfully', async () => {
      userDao.getUserById.mockResolvedValue(user);
      otpDao.isOtpValid.mockResolvedValue(true);
      utils.createAccessToken.mockReturnValue({ token: 'accessToken', expiresIn: 3600 });
      utils.createRefreshToken.mockReturnValue({ token: 'refreshToken', expiresIn: 86400 });

      const result = await userService.loginValidate(userId, emailOtp, mobileOtp, app);

      expect(userDao.getUserById).toHaveBeenCalledWith(userId);
      expect(otpDao.isOtpValid).toHaveBeenCalledWith(userId, emailOtp, 'email');
      expect(otpDao.isOtpValid).toHaveBeenCalledWith(userId, mobileOtp, 'sms');
      expect(otpDao.deleteOtpByUserID).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accessTokenExpiration: 3600,
        refreshTokenExpiration: 86400,
        user,
      });
    });

    it('should throw NotFoundError when user is not found', async () => {
      userDao.getUserById.mockResolvedValue(null);

      await expect(userService.loginValidate(userId, emailOtp, mobileOtp, app)).rejects.toThrow(NotFoundError);
      expect(userDao.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestError for invalid email OTP', async () => {
      userDao.getUserById.mockResolvedValue(user);
      otpDao.isOtpValid.mockResolvedValueOnce(false).mockResolvedValue(true);

      await expect(userService.loginValidate(userId, emailOtp, mobileOtp, app)).rejects.toThrow(BadRequestError);
      expect(otpDao.isOtpValid).toHaveBeenCalledWith(userId, emailOtp, 'email');
    });

    it('should throw BadRequestError for invalid mobile OTP', async () => {
      userDao.getUserById.mockResolvedValue(user);
      otpDao.isOtpValid.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      await expect(userService.loginValidate(userId, emailOtp, mobileOtp, app)).rejects.toThrow(BadRequestError);
      expect(otpDao.isOtpValid).toHaveBeenCalledWith(userId, mobileOtp, 'sms');
    });
  });
});
