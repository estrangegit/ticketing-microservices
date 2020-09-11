import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const sc = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

sc.on('connect', async () => {
  console.log('publisher connected to nats');

  const publisher = new TicketCreatedPublisher(sc);

  try {
    await publisher.publish({
      id: '1234',
      title: 'title',
      price: 21,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '1234',
  //   title: 'title',
  //   price: 20,
  // });

  // sc.publish('ticket:created', data, () => {
  //   console.log('ticket creation event published');
  // });
});
