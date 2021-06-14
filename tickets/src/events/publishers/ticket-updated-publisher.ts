import { Publisher, Subjects, TicketUpdatedEvent } from '@sljhtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
