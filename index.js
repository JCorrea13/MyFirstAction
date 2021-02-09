const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');

const actionType = core.getInput('action-type');

const pushReleaseVersion = async () => {
    const git = simpleGit({ baseDir: process.cwd() });
    await git.pull();

    core.info('Diff')
    core.info(JSON.stringify(git.diff('master', 'dev')))
    core.info('----------')
    await git.merge(['origin/dev', '--allow-unrelated-histories']);

    const newVersion = ops.updateVersion(actionType, process.cwd());
    await git.add('.');
    await git.commit(`Releasing Version: ${newVersion}`);
    await git.push();

    return newVersion;
};

const configureGit = () => {
    const git = simpleGit({ baseDir: process.cwd() });

    return git.addConfig('user.email', process.env.GITHUB_ACTOR, undefined)
    .then(() => git.addConfig('user.name', `${process.env.GITHUB_ACTOR}@users.noreply.github.com`, undefined));
}

configureGit()
.then(pushReleaseVersion)
.then((version) => {
    core.info(`Successfully Released: ${version}`);
})
.catch((err) => {
    // if(err.git) createMergeBranch();

    console.log(err);
    core.error(err);
});