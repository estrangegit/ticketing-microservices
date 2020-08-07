import request from 'supertest';
import { app } from '../app';

const signin = async (email: string, password: string) => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: email,
      password: password,
    })
    .expect(201);

  return resp.get('Set-Cookie');
};

export { signin as signinHelper };
