import { parseHL7Message } from "./hl7";
import util from 'util';

import testData from './data';


console.log(util.inspect(parseHL7Message(testData), false, null, true /* enable colors */))

