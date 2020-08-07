import request from 'supertest';
import { app } from '../../app';
import {
  SIGN_UP_EMAIL_VALIDATION_ERROR_MESSAGE,
  SIGN_UP_PASSWORD_VALIDATION_ERROR_MESSAGE,
} from '../signup';

it('return a 201 in successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('return a 400 with an invalid email', async () => {
  const resp = await request(app).post('/api/users/signup').send({
    email: 'testtest.com',
    password: 'password',
  });

  expect(resp.status).toBe(400);
  expect(resp.body.errors[0].message).toBe(
    SIGN_UP_EMAIL_VALIDATION_ERROR_MESSAGE
  );
});

it('return a 400 with an invalid password', async () => {
  const resp = await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'pas',
  });

  expect(resp.status).toBe(400);
  expect(resp.body.errors[0].message).toBe(
    SIGN_UP_PASSWORD_VALIDATION_ERROR_MESSAGE
  );
});

it('return a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);
});
