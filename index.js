import { info, getInput } from '@actions/core'

const actionType = getInput('actionType');
info('Executing Script');
info(actionType);