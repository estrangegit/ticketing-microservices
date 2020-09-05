import nats from 'node-nats-streaming';

console.clear();

const sc = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('publisher connected to nats');

  const data = JSON.stringify({
    id: '1234',
    title: 'title',
    price: 20,
  });

  sc.publish('ticket:created', data, () => {
    console.log('ticket creation event published');
  });
});
