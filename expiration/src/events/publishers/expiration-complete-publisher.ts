import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ettickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
