import {
  EMAIL_MUST_BE_VALID_ERROR_MESSAGE,
  INVALID_CREDENTIALS,
  YOU_MUST_SUPPLY_A_PASSWORD_ERROR_MESSAGE,
} from '@ettickets/common';
import request from 'supertest';
import { app } from '../../app';

it('return a 400 with an invalid email', async () => {
  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(EMAIL_MUST_BE_VALID_ERROR_MESSAGE);
});

it('return a 400 with an invalid password', async () => {
  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '   ',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(
    YOU_MUST_SUPPLY_A_PASSWORD_ERROR_MESSAGE
  );
});

it('fails when an email that does not exists is supplied', async () => {
  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(INVALID_CREDENTIALS);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'incorrect-password',
    })
    .expect(400);

  expect(resp.body.errors[0].message).toBe(INVALID_CREDENTIALS);
});

it('responds with a cookie when a given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(resp.get('Set-Cookie')).toBeDefined();
});
