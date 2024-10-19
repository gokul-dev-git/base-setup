/* eslint-disable no-undef */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const utils = require('../../src/utils/utils');
const { UnauthorizedError } = require('../../src/middlewares/errorHandler');

jest.mock('crypto');
jest.mock('jsonwebtoken');
jest.mock('../../src/middlewares/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('Utils', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit OTP', () => {
      crypto.randomInt.mockReturnValue(123456);
      const otp = utils.generateOtp();
      expect(otp).toBe('123456');
    });
  });

  describe('createAccessToken', () => {
    it('should create a valid access token', () => {
      const user = { id: 1, email: 'test@example.com', role: { id: 2 } };
      const sessionID = 'session-id';

      jest.spyOn(Date, 'now').mockImplementation(() => 1609459200000);
      jwt.sign.mockReturnValue('access-token');

      // eslint-disable-next-line no-unused-vars
      const { token, expiresIn } = utils.createAccessToken(user, sessionID);

      expect(token).toBe('access-token');
    });
  });

  describe('createRefreshToken', () => {
    it('should create a valid refresh token with sessionID', () => {
      const userId = 1;
      const sessionID = 'session-id';

      jwt.sign.mockReturnValue('refresh-token');

      // eslint-disable-next-line no-unused-vars
      const { token, expiresIn } = utils.createRefreshToken(userId, sessionID);

      expect(token).toBe('refresh-token');
    });

    it('should create a valid refresh token without sessionID', () => {
      const userId = 1;

      jwt.sign.mockReturnValue('refresh-token');
      const { token } = utils.createRefreshToken(userId);

      expect(token).toBe('refresh-token');
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a refresh token and return userId and sessionID', () => {
      const refreshToken = 'valid-token';
      const decoded = { userId: 1, sessionID: 'session-id' };

      jwt.verify.mockReturnValue(decoded);

      const result = utils.validateRefreshToken(refreshToken);
      expect(result).toEqual(decoded);
    });

    it('should throw UnauthorizedError if refresh token is not provided', () => {
      expect(() => utils.validateRefreshToken(null)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if refresh token is invalid', () => {
      const refreshToken = 'invalid-token';
      jwt.verify.mockImplementation(() => { throw new Error(); });

      expect(() => utils.validateRefreshToken(refreshToken)).toThrow(UnauthorizedError);
    });
  });
});
