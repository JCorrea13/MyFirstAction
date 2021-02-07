import {
    info,
    getInput
  } from '@actions/core'

const actionType = getInput('action-type');
info('Executing Script');
info(actionType);