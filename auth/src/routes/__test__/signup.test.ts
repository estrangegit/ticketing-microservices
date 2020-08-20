import {
  EMAIL_IS_ALREADY_IN_USE_ERROR_MESSAGE,
  EMAIL_MUST_BE_VALID_ERROR_MESSAGE,
  PASSWORD_MUST_BE_BETWEEN_4_and_20_CHARACTERS_ERROR_MESSAGE,
} from '@ettickets/common';
import request from 'supertest';
import { app } from '../../app';

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
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(EMAIL_MUST_BE_VALID_ERROR_MESSAGE);
});

it('return a 400 with an invalid password', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(
    PASSWORD_MUST_BE_BETWEEN_4_and_20_CHARACTERS_ERROR_MESSAGE
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

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(
    EMAIL_IS_ALREADY_IN_USE_ERROR_MESSAGE
  );
});

it('sets a cookie after successful signup', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(resp.get('Set-Cookie')).toBeDefined();
});
