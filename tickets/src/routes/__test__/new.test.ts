import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { signinHelper } from '../../test/auth-helper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const cookie = await signinHelper('test@test.com');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an empty title is provided', async () => {
  const cookie = await signinHelper('test@test.com');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: '10',
    });

  expect(response.status).toEqual(400);
});

it('returns an error if no title is provided', async () => {
  const cookie = await signinHelper('test@test.com');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it('returns an error if the provided price is negative', async () => {
  const cookie = await signinHelper('test@test.com');

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10,
    });

  expect(response.status).toEqual(400);
});

it('creates a ticket with valid inputs', async () => {
  const cookie = await signinHelper('test@test.com');

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title: string = 'title';
  const price: number = 10;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: title,
      price: price,
    });
  expect(response.status).toEqual(201);

  tickets = await Ticket.find({});

  console.log(tickets);

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
  expect(tickets[0].title).toEqual('title');
});
