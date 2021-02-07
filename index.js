const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');

const actionType = core.getInput('action-type');
const git = simpleGit();

ops.updateVersion(actionType);
await git.add();
await git.commit();
await git.push();