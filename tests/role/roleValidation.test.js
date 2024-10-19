/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const createRoleValidation = require('../../src/middlewares/validation/roleValidation');
const errorHandler = require('../../src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.post('/role', createRoleValidation, (req, res) => {
  res.status(201).json({ message: 'Role created successfully' });
});
app.use(errorHandler);

describe('POST /role Validation', () => {
  it('should create a role when valid data is provided', async () => {
    const response = await request(app).post('/role').send({
      role_name: 'Admin',
      role_desc: 'Administrator role',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Role created successfully');
  });

  it('should return 422 when role_name is missing', async () => {
    const response = await request(app).post('/role').send({
      role_desc: 'Administrator role',
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('role_name');
    expect(response.body.errors.role_name).toBe('Role name must be a string');
  });

  it('should return 422 when role_name is too short', async () => {
    const response = await request(app).post('/role').send({
      role_name: 'Ad',
      role_desc: 'Administrator role',
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('role_name');
    expect(response.body.errors.role_name).toBe('Role name must be at least 3 characters long');
  });

  it('should return 422 when role_name is not a string', async () => {
    const response = await request(app).post('/role').send({
      role_name: 123,
      role_desc: 'Administrator role',
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('role_name');
    expect(response.body.errors.role_name).toBe('Role name must be a string');
  });

  it('should return 422 when role_desc is too long', async () => {
    const longDescription = 'a'.repeat(256);
    const response = await request(app).post('/role').send({
      role_name: 'Admin',
      role_desc: longDescription,
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('role_desc');
    expect(response.body.errors.role_desc).toBe('Role description must be less than 255 characters');
  });

  it('should return 422 when role_desc is not a string', async () => {
    const response = await request(app).post('/role').send({
      role_name: 'Admin',
      role_desc: 123,
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('role_desc');
    expect(response.body.errors.role_desc).toBe('Role description must be a string');
  });
});
