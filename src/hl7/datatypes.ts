import { HL7Nested } from './base';

/**
 * Message Type
 */
export class CM_MSG extends HL7Nested {
  readonly messageType = this.field(String, 1);
  readonly triggerEvent = this.field(String, 2);
}

/**
 * Extended Person Name
 */
export class XPN extends HL7Nested {
  readonly familyName = this.field(String, 1);
  readonly givenName = this.field(String, 2);
}

/**
 * Extended Composite ID
 */
export class CX extends HL7Nested {
  readonly id = this.field(String, 1);
  readonly assigningAuthority = this.optionalField(String, 4);
}
