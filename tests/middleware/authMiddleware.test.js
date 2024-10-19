/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const authenticate = require('../../src/middlewares/authMiddleware');
const { UnauthorizedError } = require('../../src/utils/errorHandler');

jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  it('should call next with UnauthorizedError if authorization header is missing', () => {
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError('Authorization header is missing'));
  });

  it('should call next with UnauthorizedError if access token is missing', () => {
    req.headers.authorization = 'Bearer ';
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError('Access token is missing'));
  });

  it('should call next with UnauthorizedError if token verification fails', () => {
    req.headers.authorization = 'Bearer validToken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    authenticate(req, res, next);
    expect(next).toHaveBeenCalledWith(new UnauthorizedError('Invalid or expired access token'));
  });

  it('should attach user to req and call next if token is valid', () => {
    const user = { id: 1, sessionID: 'session-id' };
    req.headers.authorization = 'Bearer validToken';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, user);
    });

    authenticate(req, res, next);
    expect(req.user).toEqual(user);
    expect(req.sessionID).toBe(user.sessionID);
    expect(next).toHaveBeenCalled();
  });
});
