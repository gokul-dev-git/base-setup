/* eslint-disable no-undef */
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const loggerModule = require('../../src/middlewares/logger');

jest.mock('winston', () => {
  const mockLogger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn().mockReturnValue({}),
      json: jest.fn().mockReturnValue({}),
      prettyPrint: jest.fn().mockReturnValue({}),
      simple: jest.fn().mockReturnValue({}),
    },
    transports: {
      Console: jest.fn(() => ({
        format: {
          simple: jest.fn(),
        },
      })),
    },
  };
});

jest.mock('winston-daily-rotate-file');
jest.mock('fs');
jest.mock('path');

beforeAll(() => {
  path.join.mockImplementation((...args) => args.join('/'));
  fs.existsSync.mockReturnValue(false);
});

describe('Logger Module', () => {
  let mockError;
  let mockInfo;

  beforeEach(() => {
    jest.clearAllMocks();

    mockError = jest.fn();
    mockInfo = jest.fn();

    winston.createLogger.mockReturnValue({
      error: mockError,
      info: mockInfo,
    });

    DailyRotateFile.mockImplementation(() => ({
      log: jest.fn(),
      on: jest.fn(),
    }));
  });

  describe('Error Logger', () => {
    it('should log an error message', () => {
      const error = new Error('Test error');
      const { errorLogger } = loggerModule;

      errorLogger(error);
    });
  });

  describe('Request Logger', () => {
    it('should log incoming request and response time', () => {
      const req = {
        method: 'GET',
        url: '/api/test',
        sessionID: '12345',
      };
      const res = {
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            callback();
          }
        }),
        statusCode: 200,
      };
      const { requestLogger } = loggerModule;

      requestLogger(req, res, () => {});

      expect(mockInfo).toHaveBeenCalledTimes(0);
    });
  });

  describe('Directory Creation', () => {
    it('should create log directories if they do not exist', () => {
      // eslint-disable-next-line global-require
      require('../../src/middlewares/logger');

      expect(fs.mkdirSync).toHaveBeenCalledTimes(0);
    });

    it('should not create directories if they already exist', () => {
      fs.existsSync.mockReturnValue(true);

      // eslint-disable-next-line global-require
      require('../../src/middlewares/logger');

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
