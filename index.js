const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');

const actionType = core.getInput('action-type');
const git = simpleGit();

( async () => {
    await git.addConfig('user.email', process.env.GITHUB_ACTOR, undefined);
    await git.addConfig('user.name', `${process.env.GITHUB_ACTOR}@users.noreply.github.com`, undefined);
    
    await git.add('.');
    await git.pull('master');

    const newVersion = ops.updateVersion(actionType);
    await git.commit(`Releasing Version: ${newVersion}`);
    await git.push('origin','master');
})().then((r) => {
    core.info('successsss!');
    core.info(r);
})
.catch((e) => {
    core.info('error:');
    core.info(e);
});