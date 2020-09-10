import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const sc = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('publisher connected to nats');

  const publisher = new TicketCreatedPublisher(sc);
  publisher.publish({
    id: '1234',
    title: 'title',
    price: 21,
  });

  // const data = JSON.stringify({
  //   id: '1234',
  //   title: 'title',
  //   price: 20,
  // });

  // sc.publish('ticket:created', data, () => {
  //   console.log('ticket creation event published');
  // });
});
