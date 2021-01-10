import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../model/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('You must supply a non empty title'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('You must supply a price greater than 0'),
  ],
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const existingTicket = await Ticket.findById(req.params.id);

    if (!existingTicket) {
      throw new NotFoundError();
    }

    if (existingTicket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (req.currentUser!.id !== existingTicket.userId) {
      throw new NotAuthorizedError();
    }

    existingTicket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await existingTicket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: existingTicket.id!,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      version: existingTicket.version,
    });

    res.status(200).send(existingTicket);
  }
);

export { router as updateTicketRouter };
