import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signinHelper } from '../../test/auth-helper';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = signinHelper();
  const id = mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: id });

  expect(response.status).not.toEqual(401);
});

it('returns an error if an empty ticketId is provided', async () => {
  const cookie = signinHelper();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '',
    });

  expect(response.status).toEqual(400);
});

it('returns an error if no ticketId is provided', async () => {
  const cookie = signinHelper();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).toEqual(400);
});

it('returns an error if the ticketId is not a valid mongoose Id', async () => {
  const cookie = signinHelper();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '1234',
    });

  expect(response.status).toEqual(400);
});

it('returns a 404 error if the ticket does not exists', async () => {
  const cookie = signinHelper();
  const ticketId = mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId });

  expect(response.status).toEqual(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const cookie = signinHelper();

  const title: string = 'title';
  const price: number = 10;

  const ticket = Ticket.build({
    title,
    price,
  });

  await ticket.save();

  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    });

  expect(response.status).toEqual(400);
});

it('create an order an reserves a ticket', async () => {
  const cookie = signinHelper();

  const title: string = 'title';
  const price: number = 10;

  const ticket = Ticket.build({
    title,
    price,
  });

  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    });

  expect(response.status).toEqual(201);

  const orders = await Order.find({}).populate('ticket');
  expect(orders.length).toEqual(1);
  expect(orders[0].ticket.price).toEqual(10);
  expect(orders[0].ticket.title).toEqual('title');

  const tickets = await Order.find({});
  expect(tickets.length).toEqual(1);
});

it.todo('emit an order created event');
