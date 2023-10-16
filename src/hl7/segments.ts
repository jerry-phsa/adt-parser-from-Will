import { HL7Nested } from './base';
import { AliasUsage, CM_MSG, CX, PL, SD, ST, XCN, XPN, ZP } from './datatypes';

const MRN_AUTHORITY = 'VPP_CER';
const PHN_AUTHORITY = 'BCPHN';

export class MSH extends HL7Nested {
  readonly messageType = this.field(CM_MSG, 9);
}

export class PID extends HL7Nested {
  readonly internalIds = this.list(CX, 3);
  readonly alternateIds = this.list(CX, 4);
  readonly name = this.field(XPN, 5);
  readonly alias = this.field(AliasUsage, 9);
  readonly dateOfBirth = this.field(String, 7);
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
  readonly encounterClass = this.field(String, 2);
  readonly encounterLocation = this.field(PL, 3);
  readonly admissionType = this.field(String, 4);
  readonly attendingDoctor = this.optionalField(XCN, 7);
  readonly referringDoctor = this.optionalField(XCN, 8); // Not implemented
  readonly consultingDoctor = this.optionalField(XCN, 9); // Not implemented
  readonly serviceType = this.field(String, 10);
  readonly admissionSource = this.field(String, 14); // Not implemented
  readonly admittingDoctor = this.field(XCN, 17);
  readonly type = this.field(String, 18);
  readonly dischargeDisposition = this.field(String, 36); // Not implemented
  readonly facility = this.field(String, 39);
  readonly timeStamp = this.optionalField(ST, 44);
  readonly timeStampDischarged = this.optionalField(SD, 45);
}

export class ZPI extends HL7Nested {
  readonly vipIndicator = this.optionalField(ZP, 22);
}

export class MRG extends HL7Nested {
  readonly priorPatientIdentifiers = this.list(CX, 1);

  readonly priorPatientMrn: string = (() => {
    const mrnId = this.priorPatientIdentifiers.find(
      (id) => id.assigningAuthority === MRN_AUTHORITY,
    );
    if (mrnId === undefined) {
      throw Error('MRN is not defined for MRG block');
    } else {
      return mrnId.id;
    }
  })();
}
