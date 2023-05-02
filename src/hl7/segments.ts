import { HL7Nested } from './base';
import { CM_MSG, CX, XPN } from './datatypes';

const MRN_AUTHORITY = 'VPP_CER';
const PHN_AUTHORITY = 'BCPHN';

export class MSH extends HL7Nested {
  readonly messageType = this.field(CM_MSG, 9);
}

export class PID extends HL7Nested {
  readonly internalIds = this.list(CX, 3);
  readonly alternateIds = this.list(CX, 4);
  readonly name = this.field(XPN, 5);
  readonly dateOfBirth = this.field(Date, 7);
  readonly sex = this.field(String, 8) as 'F' | 'M' | 'O' | 'U';
  readonly encounterId: string | undefined = this.optionalField(CX, 18)?.id;

  readonly mrn: string = (() => {
    const mrnId = this.internalIds.find(
      (id) => id.assigningAuthority === MRN_AUTHORITY,
    );
    if (mrnId === undefined) {
      throw Error('MRN is not defined for patient');
    } else {
      return mrnId.id;
    }
  })();

  readonly phn: string | undefined = (() => {
    return this.alternateIds.find(
      (id) => id.assigningAuthority === PHN_AUTHORITY,
    )?.id;
  })();
}

export class PV1 extends HL7Nested {
  readonly admitSource = this.field(String, 17);
}
