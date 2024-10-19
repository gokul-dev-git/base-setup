/* eslint-disable no-undef */
const userService = require('../../../src/services/authService');
const userDao = require('../../../src/dao/userDao');
const utils = require('../../../src/utils/utils');
const { NotFoundError } = require('../../../src/middlewares/errorHandler');

jest.mock('../../../src/dao/userDao');
jest.mock('../../../src/utils/utils');
jest.mock('../../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('User Service', () => {
  describe('refreshTokens', () => {
    const req = {};
    const refreshToken = 'someRefreshToken';
    const userId = 1;
    const sessionID = 'someSessionID';
    const user = {
      id: userId,
      email_id: 'test@example.com',
      mobile_number: '1234567890',
    };

    beforeEach(() => {
      req.sessionID = null;
      utils.validateRefreshToken.mockReturnValue({ userId, sessionID });
    });

    it('should return new access and refresh tokens successfully', async () => {
      userDao.getUserById.mockResolvedValue(user);
      utils.createAccessToken.mockReturnValue({ token: 'newAccessToken', expiresIn: 3600 });
      utils.createRefreshToken.mockReturnValue({ token: 'newRefreshToken', expiresIn: 86400 });

      const result = await userService.refreshTokens(req, refreshToken);

      expect(req.sessionID).toBe(sessionID);
      expect(userDao.getUserById).toHaveBeenCalledWith(userId);
      expect(utils.createAccessToken).toHaveBeenCalledWith(user, sessionID);
      expect(utils.createRefreshToken).toHaveBeenCalledWith(userId, sessionID);
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        accessTokenExpiration: 3600,
        refreshTokenExpiration: 86400,
      });
    });

    it('should throw NotFoundError when user is not found', async () => {
      userDao.getUserById.mockResolvedValue(null);

      await expect(userService.refreshTokens(req, refreshToken)).rejects.toThrow(NotFoundError);
      expect(userDao.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
