
import { HL7Nested } from './base';
import { MSH, PID, PV1 } from './segments';

export class EventBase extends HL7Nested {
  readonly messageHeader = this.field(MSH, 'MSH');
  readonly patientIdentification = this.field(PID, 'PID');

  static parseEvent(event: object): Event {
  //  console.log('Header:', new EventBase(event))
    const messageType = new EventBase(event).messageHeader.messageType;
    
    if (messageType.triggerEvent in EVENTS_BY_CODE) {
      return new EVENTS_BY_CODE[messageType.triggerEvent](event);
    } else {
      throw new Error(
        `Cannot handle trigger event code ${messageType.triggerEvent}`,
      );
    }
  }
}

/**
 * A01.
 */
export class AdmitOrVisitNotification extends EventBase {}

/**
 * A03.
 */
export class DischargeOrEndVisit extends EventBase {}

/**
 * An A05 event is sent when a patient undergoes the pre-admission process.
 * During this process, episoderelated data is collected in preparation for a patient’s visit or stay in a healthcare facility.
 * For example, a preadmit may be performed prior to inpatient or outpatient surgery so that lab tests
 * can be performed prior to the surgery. This event can also be used to pre-register a non-admitted patient.
 */
export class PreAdmitPatient extends EventBase {}

/**
 * An A04 event signals that the patient has arrived or checked in as a one-time, or recurring outpatient,
 * and is not assigned to a bed. One example might be its use to signal the beginning of a visit to the Emergency Room.
 * Note that some systems refer to these events as outpatient registrations or emergency admissions.
 * PV1-44-admit date time is used for the visit start date/time.
 */
export class RegisterPatient extends EventBase {
  readonly patientVisit = this.field(PV1, 'PV1');
}

/**
 * A08. This trigger event is used when any patient information has changed but when no other
 * trigger event has occurred. For example, an A08 event can be used to notify the receiving systems
 * of a change of address or a name change. We recommend that the A08 transaction be used to update fields
 * that are not related to any of the other trigger events.
 * The A08 event can include information specific to an episode of care,
 * but it can also be used for demographic information only.
 */
export class UpdatePatientInformation extends EventBase {}

/**
 * The A13 event is sent when an A03 (discharge/end visit) event is cancelled,
 * either because of erroneous entry of the A03 event or because of a decision not to discharge
 * or end the visit of the patient after all.
 * PV1-3 - Assigned Patient Location should reflect the location of the patient after the cancellation
 * has been processed. Note that this location may be different from the patient’s location prior to the erroneous discharge.
 * Prior Location could be used to show the location of the patient prior to the erroneous discharge.
 */
export class CancelDischarge extends EventBase {}

/**
 * A23. Delete visit specific information.
 * This is used by Cerner to cancel an encounter of an outpatient.
 */
export class DeletePatient extends EventBase {}

/**
 * An A31 event can be used to update person information on an MPI.
 * It is similar to an A08 (update patient information) event, but an A08 (update patient information)
 * event should be used to update patient information for a current episode.
 * An A28 (add person information) or A31 can also be used for backloading MPI information for the person,
 * or for backloading person and historical information.
 */
export class UpdatePersonInformation extends EventBase {}

/**
 * An A34 (merge patient information-patient ID only) event is intended for merging or changing patient identifiers.
 * It would be used to change patient identifiers on all of this patient’s existing accounts.
 */
export class MergePatientInformationIdOnly extends EventBase {}

/**
 * The A38 event is sent when an A05 (pre-admit a patient) event is cancelled, either because of erroneous entry of the A05 event or because of a decision not to pre-admit the patient after all.
 */
export class CancelPreAdmit extends EventBase {}

/**
 * The A28 event can be used to send everything that is known about a person.
 * For example, it can be sent to an ICU unit (in addition to the A02 (transfer a patient) event)
 * when a patient is transferred to the ICU unit in order to backload all demographic information
 * for the patient into the ICU system. An A28 (add person information) or A31 (update person information)
 * can also be used for backloading MPI information for the person,
 * or for backloading person and historical information.
 */
export class AddPersonInformation extends EventBase {}

/**
 * A move has been done at the account identifier level. That is, a PID-18 - Patient Account Number associated
 * with one PID-3 - Patient Identifier List has been moved to another patient identifier list.
 */
export class MoveAccountInformationPatientAccountNumber extends EventBase {}

const EVENTS_BY_CODE = {
  A01: AdmitOrVisitNotification,
  A03: DischargeOrEndVisit,
  A04: RegisterPatient,
  A05: PreAdmitPatient,
  A08: UpdatePatientInformation,
  A13: CancelDischarge,
  A23: DeletePatient,
  A28: AddPersonInformation,
  A31: UpdatePersonInformation,
  A34: MergePatientInformationIdOnly,
  A38: CancelPreAdmit,
  A44: MoveAccountInformationPatientAccountNumber,
} as const;

export type EventType = keyof typeof EVENTS_BY_CODE;
export type Event = (typeof EVENTS_BY_CODE)[EventType] & EventBase;
