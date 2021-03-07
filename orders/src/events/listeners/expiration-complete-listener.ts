import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from '@ettickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // Find the order for which the expiration delay has been completed
    const order = await Order.findById(data.orderId).populate('ticket');

    // Throw an error if the order has not been found
    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // Mark the order of beeing cancelled
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // Emit an orderCancelledEvent for tickets and payments services
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id!,
      ticket: {
        id: order.ticket.id!,
      },
      version: order.version,
    });

    // ack the message
    msg.ack();
  }
}
