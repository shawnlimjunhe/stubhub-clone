import { Publisher, Subjects, TicketCreatedEvent } from '@sljhtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
