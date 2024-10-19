/* eslint-disable no-undef */
const userService = require('../../../src/services/authService');
const userDao = require('../../../src/dao/userDao');
const otpDao = require('../../../src/dao/otpDao');
const communicationService = require('../../../src/services/communicationService');
const { BadRequestError, NotFoundError } = require('../../../src/middlewares/errorHandler');
const utils = require('../../../src/utils/utils');

jest.mock('../../../src/dao/userDao');
jest.mock('../../../src/dao/otpDao');
jest.mock('../../../src/services/communicationService');
jest.mock('../../../src/utils/utils');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('User Service', () => {
  describe('loginUser', () => {
    const email = 'test@example.com';
    const mobile = '1234567890';
    const role = 2;
    const app = 1;

    it('should send OTPs and return user data successfully', async () => {
      const user = {
        id: 1,
        email_id: email,
        mobile_number: mobile,
        role: { id: role },
        is_active: true,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          email_id: email,
          mobile_number: mobile,
          role: { id: role },
          is_active: true,
        }),
      };
      userDao.getUserByEmail.mockResolvedValue(user);
      utils.generateOtp.mockReturnValue('123456');

      await userService.loginUser(email, mobile, role, app);

      expect(userDao.getUserByEmail).toHaveBeenCalledWith(email);
      expect(otpDao.deleteOtpByUserID).toHaveBeenCalledWith(user.id);
      expect(otpDao.saveOtp).toHaveBeenCalledTimes(2);
      expect(otpDao.saveOtp).toHaveBeenCalledWith({
        user_id: user.id,
        otp_code: '123456',
        delivery_type: 'email',
        app,
      });
      expect(otpDao.saveOtp).toHaveBeenCalledWith({
        user_id: user.id,
        otp_code: '123456',
        delivery_type: 'sms',
        app,
      });
      expect(communicationService.sendEmailOtp).toHaveBeenCalledWith(user.email_id, '123456');
      expect(communicationService.sendSmsOtp).toHaveBeenCalledWith(user.mobile_number, '123456');
    });

    it('should throw NotFoundError when user is not found', async () => {
      userDao.getUserByEmail.mockResolvedValue(null);

      await expect(userService.loginUser(email, mobile, role, app)).rejects.toThrow(NotFoundError);
      expect(userDao.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundError when mobile or role does not match', async () => {
      const user = {
        id: 1,
        email_id: email,
        mobile_number: 'different_mobile',
        role: { id: 1 },
        is_active: true,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          email_id: email,
          mobile_number: 'different_mobile',
          role: { id: 1 },
          is_active: true,
        }),
      };
      userDao.getUserByEmail.mockResolvedValue(user);

      await expect(userService.loginUser(email, mobile, role, app)).rejects.toThrow(NotFoundError);
      expect(userDao.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequestError when user is inactive', async () => {
      const user = {
        id: 1,
        email_id: email,
        mobile_number: mobile,
        role: { id: role },
        is_active: false,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          email_id: email,
          mobile_number: mobile,
          role: { id: role },
          is_active: false,
        }),
      };
      userDao.getUserByEmail.mockResolvedValue(user);

      // eslint-disable-next-line max-len
      await expect(userService.loginUser(email, mobile, role, app)).rejects.toThrow(BadRequestError);
      expect(userDao.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequestError for role 4 when email or mobile is missing', async () => {
      const user = {
        id: 1,
        email_id: null,
        mobile_number: null,
        role: { id: 4 },
        is_active: true,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          email_id: null,
          mobile_number: null,
          role: { id: 4 },
          is_active: true,
        }),
      };
      userDao.getUserByEmail.mockResolvedValue(user);

      await expect(userService.loginUser(email, mobile, 4, app)).rejects.toThrow(BadRequestError);
      expect(userDao.getUserByEmail).toHaveBeenCalledWith(email);
    });
  });
});
