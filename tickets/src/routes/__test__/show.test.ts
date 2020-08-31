import request from 'supertest';
import { app } from '../../app';
import { signinHelper } from '../../test/auth-helper';

it('returns a 404 if the ticket is not found', async () => {
  await request(app).get('/api/tickets/fake-id').send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'title';
  const price = 10;

  const cookie = await signinHelper('test@test.com');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app).get(
    `/api/tickets/${response.body.id}`
  );

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
