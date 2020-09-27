import { OrderStatus } from '@ettickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signinHelper } from '../../test/auth-helper';

it('has a route handler listening to /api/orders/:orderId for delete requests', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app).delete(`/api/orders/${orderId}`);
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app).delete(`/api/orders/${orderId}`);
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = signinHelper();
  const orderId = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', cookie);

  expect(response.status).not.toEqual(401);
});

it('returns an error if the orderId is not a valid mongoose Id', async () => {
  const cookie = signinHelper();

  const response = await request(app)
    .delete(`/api/orders/1234`)
    .set('Cookie', cookie);

  expect(response.status).toEqual(400);
});

it('returns an error if the user try to fetch another user order', async () => {
  const ticket = Ticket.build({
    title: 'title',
    price: 10,
  });

  await ticket.save();

  const cookie1 = signinHelper();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const cookie2 = signinHelper();
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie2)
    .expect(401);
});

it('cancels the order', async () => {
  const ticket = Ticket.build({
    title: 'title',
    price: 10,
  });

  await ticket.save();

  const cookie = signinHelper();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(order.status).toEqual(OrderStatus.Created);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emit an order cancelled event');
