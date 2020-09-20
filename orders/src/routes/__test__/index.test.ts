import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signinHelper } from '../../test/auth-helper';

const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    title,
    price,
  });

  await ticket.save();
  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticket1 = await buildTicket('title1', 10);
  const ticket2 = await buildTicket('title2', 20);
  const ticket3 = await buildTicket('title3', 30);

  // create one order as User #1
  const cookieUser1 = signinHelper();
  const response1 = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser1)
    .send({
      ticketId: ticket1.id,
    });
  expect(response1.status).toEqual(201);

  // create two orders as User #2
  const cookieUser2 = signinHelper();
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookieUser2)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  // make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookieUser2)
    .send();

  expect(response.status).toEqual(200);

  // make sure we only get the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
