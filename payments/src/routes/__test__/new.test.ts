import { OrderStatus } from '@ettickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { signinHelper } from '../../test/auth-helper';

it('returns a 404 when purchasing an order that does not exists', async () => {
  const cookie = signinHelper();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fake-token',
      orderId: mongoose.Types.ObjectId().toHexString(),
    });
  expect(response.status).toEqual(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  const cookie = signinHelper();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fake-token',
      orderId: order.id,
    });
  expect(response.status).toEqual(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: 10,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  const cookie = signinHelper(userId);

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'fake-token',
      orderId: order.id,
    });

  expect(response.status).toEqual(400);
});
