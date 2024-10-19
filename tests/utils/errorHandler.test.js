/* eslint-disable no-undef */
const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require('../../src/utils/errorHandler');

describe('Error Handler', () => {
  describe('AppError', () => {
    it('should create an instance of AppError with correct properties', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('BadRequestError', () => {
    it('should create an instance of BadRequestError with default message', () => {
      const error = new BadRequestError();
      expect(error.message).toBe('Bad request');
      expect(error.statusCode).toBe(400);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create an instance of BadRequestError with custom message', () => {
      const error = new BadRequestError('Custom bad request message');
      expect(error.message).toBe('Custom bad request message');
      expect(error.statusCode).toBe(400);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an instance of UnauthorizedError with default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create an instance of UnauthorizedError with custom message', () => {
      const error = new UnauthorizedError('Custom unauthorized message');
      expect(error.message).toBe('Custom unauthorized message');
      expect(error.statusCode).toBe(401);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('NotFoundError', () => {
    it('should create an instance of NotFoundError with default message', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create an instance of NotFoundError with custom message', () => {
      const error = new NotFoundError('Custom not found message');
      expect(error.message).toBe('Custom not found message');
      expect(error.statusCode).toBe(404);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('InternalServerError', () => {
    it('should create an instance of InternalServerError with default message', () => {
      const error = new InternalServerError();
      expect(error.message).toBe('Internal server error');
      expect(error.statusCode).toBe(500);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create an instance of InternalServerError with custom message', () => {
      const error = new InternalServerError('Custom internal server error message');
      expect(error.message).toBe('Custom internal server error message');
      expect(error.statusCode).toBe(500);
      expect(error).toBeInstanceOf(AppError);
    });
  });
});
