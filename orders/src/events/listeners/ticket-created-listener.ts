import { Listener, Subjects, TicketCreatedEvent } from '@ettickets/common';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'order-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {}
}
