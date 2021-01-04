import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  async publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.client.publish(this.subject, JSON.stringify(data), (err, guid) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `event published to subject ${this.subject} with guid ${guid}`
          );
          resolve();
        }
      });
    });
  }
}
