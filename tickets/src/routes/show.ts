import { NotFoundError } from '@ettickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const existingTicket = await Ticket.findById(req.params.id);

  if (!existingTicket) {
    throw new NotFoundError();
  }

  res.send(existingTicket);
});

export { router as showTicketRouter };
