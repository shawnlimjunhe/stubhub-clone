import { Publisher, OrderCancelledEvent, Subjects } from '@sljhtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
