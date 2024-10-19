/* eslint-disable no-undef */
const OtpDao = require('../../src/dao/otpDao');
const db = require('../../src/config/sequelizeConfig');

const { Otp } = db;

jest.mock('../../src/config/sequelizeConfig', () => ({
  Otp: {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('OtpDao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOtp', () => {
    it('should save OTP and return the created OTP', async () => {
      const otpData = { user_id: 1, otp_code: '123456', delivery_type: 'email' };
      const createdOtp = { id: 1, ...otpData };

      Otp.create.mockResolvedValue(createdOtp);

      const result = await OtpDao.saveOtp(otpData);
      expect(result).toEqual(createdOtp);
      expect(Otp.create).toHaveBeenCalledWith(otpData);
    });
  });

  describe('findOtp', () => {
    it('should find and return an OTP', async () => {
      const otpData = { user_id: 1, otp_code: '123456', delivery_type: 'email' };
      Otp.findOne.mockResolvedValue(otpData);

      const result = await OtpDao.findOtp(1, '123456', 'email');
      expect(result).toEqual(otpData);
      expect(Otp.findOne).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          otp_code: '123456',
          delivery_type: 'email',
        },
      });
    });

    it('should return null if OTP not found', async () => {
      Otp.findOne.mockResolvedValue(null);

      const result = await OtpDao.findOtp(1, '123456', 'email');
      expect(result).toBeNull();
    });
  });

  describe('isOtpValid', () => {
    it('should return true if OTP is valid', async () => {
      const validOtp = {
        user_id: 1, otp_code: '123456', delivery_type: 'email', created_at: new Date(),
      };
      Otp.findOne.mockResolvedValue(validOtp);

      const result = await OtpDao.isOtpValid(1, '123456', 'email');
      expect(result).toBe(true);
    });

    it('should return false if OTP is invalid or expired', async () => {
      Otp.findOne.mockResolvedValue(null);

      const result = await OtpDao.isOtpValid(1, '123456', 'email');
      expect(result).toBe(false);
    });
  });

  describe('deleteOtp', () => {
    it('should delete an OTP by ID', async () => {
      Otp.destroy.mockResolvedValue(1);

      const result = await OtpDao.deleteOtp(1);
      expect(result).toBe(1);
      expect(Otp.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('deleteOtpByUserID', () => {
    it('should delete OTPs by user ID', async () => {
      Otp.destroy.mockResolvedValue(2);

      const result = await OtpDao.deleteOtpByUserID(1);
      expect(result).toBe(2);
      expect(Otp.destroy).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });
  });

  describe('deleteExpiredOtps', () => {
    it('should delete expired OTPs', async () => {
      Otp.destroy.mockResolvedValue(3);

      const result = await OtpDao.deleteExpiredOtps();
      expect(result).toBe(3);
      expect(Otp.destroy).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          created_at: expect.any(Object),
        }),
      }));
    });
  });
});
