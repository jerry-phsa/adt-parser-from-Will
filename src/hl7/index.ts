import { Event, EventBase } from './events';

export * from './datatypes';
export * from './events';
export * from './segments';

export type HL7Message = { HL7Message: object[] };

export function parseHL7Message(data: HL7Message): Event[] {
  return data.HL7Message.map((msg) => EventBase.parseEvent(msg));
}
