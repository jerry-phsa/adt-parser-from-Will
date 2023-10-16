import { parseHL7Message } from "./hl7";
import util from 'util';

import testData from './data';

// console.log((parseHL7Message(testData)as any)[0]?.messageHeader)
console.log(util.inspect(parseHL7Message(testData), false, null, true /* enable colors */))

