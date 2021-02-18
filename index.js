const core = require('@actions/core');
const ops = require('./jsonOperations');
const ghUtilities = require('./utils');
const actions = require('./actions');

const actionType = core.getInput('action-type');
const token = core.getInput('github_token');
const sprint = core.getInput('sprint');
const releaseNotes = core.getInput('release-notes');
const prodBranch = core.getInput('prod-branch');

const gh = ghUtilities.getUtilities(token, process);

const pushReleaseVersion = async () => {
    const choreBranchName = `Chore/Sprint${sprint}`;
    
    const defaultBranchName = await gh.getDefaultBranch();
    await gh.createNewBranch(prodBranch, choreBranchName);
    const mergeInfo = await gh.mergeBranches(choreBranchName, defaultBranchName);

    if(!mergeInfo.files  || mergeInfo.files.length == 0) {
        core.info('There is no changes to be published');
        await gh.deleteBranch(choreBranchName);
        return;
    }
    
    const packageJson = await gh.getContent(choreBranchName, 'package.json');
    const newJson = ops.updateVersion(packageJson.content, actionType);
    await gh.commitContent(
        'package.json',
        `Updating Package Version to ${newJson.version}`,
        Buffer.from(JSON.stringify(newJson, undefined, 4)).toString('base64'),
        packageJson.sha,
        choreBranchName);

    const pr = await gh.createPR(prodBranch, choreBranchName);
    const merge = await gh.mergePR(pr.number);

    await gh.deleteBranch(choreBranchName);

    await gh.createTag(merge.sha, sprint, releaseNotes);
    return newJson.version;
};

const pushMergeBackVersion = async () => {
    throw new Error('Not Implemented');
}
const action = actionType === actions.types.Release ? pushReleaseVersion : pushMergeBackVersion;

action()
.then((version) => {
    core.info(`Successfully Released Package Version: ${version}`);
})
.catch((err) => {
    core.error(err);
});