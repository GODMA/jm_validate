# jm_validate
Verification param tool made by mySelf
## how to use
import { validatorData } from "./validate";

import { activeRule } from "./rules/active";

let activeInfo = validatorData(param.activeInfo, activeRule.activeInfo, false);
