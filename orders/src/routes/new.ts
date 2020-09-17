import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('ticketId must be provided and must be a valid mongodb Id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const existingTicket = await Ticket.findById(ticketId);

    if (!existingTicket) {
      throw new NotFoundError();
    }

    // Find the ticket the user is trying to order in the database
    const existingOrder = await Order.findOne({
      ticket: existingTicket,
      status: {
        $in: [
          OrderStatus.AwaitingPayment,
          OrderStatus.Created,
          OrderStatus.Complete,
        ],
      },
    })
      .populate({ path: 'ticket', _id: ticketId })
      .exec();

    if (existingOrder) {
      throw new BadRequestError('ticket is already reserved');
    }
    // Make sure that this ticket is not already reserved

    // Calcluate an expiration date for this order

    // Build the order and save it to the database

    // Publish an event saying that an order was created

    res.send({});
  }
);

export { router as createOrderRouter };
