import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { signinHelper } from '../../test/auth-helper';

it('returns a 404 if the provided id does not exists', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  const cookie = signinHelper();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(401);
});

it('returns a 401 if the user does not owned the ticket', async () => {
  const title = 'title1';
  const price = 1;

  const cookie1 = signinHelper();

  const postResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie1)
    .send({
      title,
      price,
    })
    .expect(201);

  expect(postResponse.body.title).toEqual('title1');
  expect(postResponse.body.price).toEqual(1);

  const cookie2 = signinHelper();

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie2)
    .send({
      title: 'title2',
      price: 2,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const title = 'title1';
  const price = 1;

  const cookie = signinHelper();

  const postResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  expect(postResponse.body.title).toEqual('title1');
  expect(postResponse.body.price).toEqual(1);

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: price,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      price: -10,
    })
    .expect(400);
});

it('updates the ticket if inputs are valid', async () => {
  const cookie = signinHelper();

  const postResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 1,
    })
    .expect(201);

  expect(postResponse.body.title).toEqual('title1');
  expect(postResponse.body.price).toEqual(1);

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 2,
    })
    .expect(200);

  const getResponse = await request(app)
    .get(`/api/tickets/${postResponse.body.id}`)
    .expect(200);

  expect(getResponse.body.title).toEqual('title2');
  expect(getResponse.body.price).toEqual(2);
});

it('publishes an event', async () => {
  const cookie = signinHelper();

  const postResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 1,
    })
    .expect(201);

  expect(postResponse.body.title).toEqual('title1');
  expect(postResponse.body.price).toEqual(1);

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 2,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signinHelper();

  const postResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 1,
    })
    .expect(201);

  const ticket = await Ticket.findById(postResponse.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${postResponse.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 2,
    })
    .expect(400);
});
