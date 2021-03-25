import { OrderStatus } from '@ettickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { signinHelper } from '../../test/auth-helper';

// line used to mock stripe api with stripe.old.ts file
// jest.mock('../../stripe');

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

it('returns 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price,
    status: OrderStatus.Created,
  });

  await order.save();

  const cookie = signinHelper(userId);

  await request(app).post('/api/payments').set('Cookie', cookie).send({
    token: 'tok_visa',
    orderId: order.id,
  });

  const stripeCharges = await stripe.charges.list();

  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
