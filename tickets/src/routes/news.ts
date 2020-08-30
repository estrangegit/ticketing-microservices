import { requireAuth, validateRequest } from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
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
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
