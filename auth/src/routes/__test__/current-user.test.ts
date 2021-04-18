import request from 'supertest';
import { app } from '../../app';
import { signinHelper } from '../../test/auth-helper';

it('responds with details about the current user', async () => {
  const email = 'test@test.com';
  const password = 'password';

  const cookie = await signinHelper(email, password);

  const resp = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(resp.body.currentUser.email).toEqual(email);
});

it('responds with null if not authenticated', async () => {
  const resp = await request(app).get('/api/users/currentuser').expect(200);

  expect(resp.body.currentUser).toEqual(null);
});
