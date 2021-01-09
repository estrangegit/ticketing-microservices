import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from '@ettickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../model/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw an error
    if (!ticket) {
      throw new NotFoundError();
    }

    // Mark the ticket as not being reserved any more
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();

    // Publish an event to notice that a ticket has been updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the message
    msg.ack();
  }
}
