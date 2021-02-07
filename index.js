const core = require('@actions/core');

const actionType = core.getInput('action-type');
info('Executing Script');
info(actionType);