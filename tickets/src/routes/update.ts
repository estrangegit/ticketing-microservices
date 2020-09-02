import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/ticket';

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

    if (req.currentUser!.id !== existingTicket.userId) {
      throw new NotAuthorizedError();
    }

    existingTicket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await existingTicket.save();

    res.status(200).send(existingTicket);
  }
);

export { router as updateTicketRouter };
