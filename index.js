const core = require('@actions/core');

const actionType = core.getInput('action-type');
core.info('Executing Script');
core.info(actionType)