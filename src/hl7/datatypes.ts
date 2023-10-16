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
  readonly use = this.field(String, 7);
}

export class AliasUsage extends HL7Nested {
  readonly familyName = this.optionalField(String, 1);
  readonly givenName = this.optionalField(String, 2);
  readonly use = this.optionalField(String, 7);
}

/**
 * Extended Composite ID
 */
export class CX extends HL7Nested {
  readonly id = this.field(String, 1);
  readonly assigningAuthority = this.optionalField(String, 4);
}

/**
 * Person Location
 */
export class PL extends HL7Nested {
  readonly location = this.field(String, 1); // AKA point of service
  readonly room = this.field(String, 2);
  readonly bed = this.field(String, 3);
  readonly facility = this.field(String, 4);
}

/**
 * Extended Composite ID Number and Name for Persons
 */
export class XCN extends HL7Nested {
  readonly id = this.optionalField(String, 1);
  readonly familyName = this.optionalField(String, 2);
  readonly givenName = this.optionalField(String, 3);
  readonly suffix = this.optionalField(String, 5);
  readonly prefix = this.optionalField(String, 6);
  readonly degree = this.optionalField(String, 7);
  readonly assigningAuthority = this.optionalField(String, 9);
  readonly use = this.optionalField(String, 10);
}

/**
 * Extended Composite for Time Stamp - Admit Time
 */
export class ST extends HL7Nested {
  readonly admitTime = this.optionalField(String, 1);
}

/**
 * Extended Composite for Time Stamp - Discharge Time
 */
export class SD extends HL7Nested {
  readonly dischargeTime = this.optionalField(String, 1);
}

/**
 * Additional Information
 */
export class ZP extends HL7Nested {
  readonly vipStatus = this.optionalField(ZPN, 1);
}
export class ZPN extends HL7Nested {
  readonly vipStatus = this.optionalField(String, 1);
}
