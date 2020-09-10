import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const sc = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('listener connected to nats');

  sc.on('close', () => {
    console.log('nats connection closed!');
    process.exit();
  });

  new TicketCreatedListener(sc).listen();
});

process.on('SIGINT', () => sc.close());
process.on('SIGTERM', () => sc.close());
