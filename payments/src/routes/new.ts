import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ettickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  [
    body('token').notEmpty().withMessage('You must supply a non empty token'),
    body('orderId')
      .notEmpty()
      .withMessage('You must supply a non empty orderId'),
  ],
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('You cannot charge a cancelled order');
    }

    res.status(201).send({ res: true });
  }
);

export { router as createChargeRouter };
