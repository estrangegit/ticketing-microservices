import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateMongoIdBodyElement,
  validateRequest,
} from '@ettickets/common';
import express, { Request, Response } from 'express';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  validateMongoIdBodyElement('ticketId'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const existingTicket = await Ticket.findById(ticketId);

    if (!existingTicket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await existingTicket.isReserved();

    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }

    // Calcluate an expiration date for this order
    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket: existingTicket,
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id!,
      status: order.status,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: existingTicket.id!,
        price: existingTicket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
