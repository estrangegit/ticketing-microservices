import request from 'supertest';
import { app } from '../../app';
import { signinHelper } from '../../test/auth-helper';

const createTicket = async (title: string, price: number) => {
  const cookie = signinHelper();
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title,
    price,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket('title1', 1);
  await createTicket('title2', 2);
  await createTicket('title3', 3);

  const ticketsResponse = await request(app).get('/api/tickets');

  expect(ticketsResponse.body.length).toEqual(3);
  expect(ticketsResponse.body[0].title).toEqual('title1');
  expect(ticketsResponse.body[2].price).toEqual(3);
});
