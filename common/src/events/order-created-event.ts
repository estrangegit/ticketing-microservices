import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string | undefined;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string | undefined;
      price: number;
    };
  };
}
