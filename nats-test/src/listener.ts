import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

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

  const options = sc.subscriptionOptions();
  options.setManualAckMode(true);
  options.setDeliverAllAvailable();
  options.setDurableName('accounting-service');

  const subscription = sc.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`);
    }
    msg.ack();
  });
});

process.on('SIGINT', () => sc.close());
process.on('SIGTERM', () => sc.close());
