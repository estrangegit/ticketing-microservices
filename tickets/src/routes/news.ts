import { requireAuth, validateRequest } from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

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
    res.sendStatus(201);
  }
);

export { router as createTicketRouter };
