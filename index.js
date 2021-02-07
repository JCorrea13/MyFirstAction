const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');

const actionType = core.getInput('action-type');
const git = simpleGit();

const newVersion = ops.updateVersion(actionType);
( async () => {
    await git.addConfig('user.email', process.env.GITHUB_ACTOR, undefined);
    await git.addConfig('user.name', `${process.env.GITHUB_ACTOR}@users.noreply.github.com`, undefined);

    await git.add('.');
    await git.pull();
    await git.commit(`Releasing Version: ${newVersion}`);
    await git.push();
})().then(() => {
    core.info('successsss!');
})
.catch((e) => {
    core.info('error:');
    core.info(e);
});