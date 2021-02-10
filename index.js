const core = require('@actions/core');
const ops = require('./jsonOperations');
const github = require('@actions/github');

const actionType = core.getInput('action-type');
const token = core.getInput('github_token');
const sprint = core.getInput('sprint');
const releaseNotes = core.getInput('release-notes');


const octokit = github.getOctokit(token);
const repo = github.context.repo;

const pushReleaseVersion = async () => {
    const newJson = ops.updateVersion(actionType, process.cwd());
    const newRef = `refs/heads/Chore/Sprint${sprint}`;

    const masterBranch = await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: 'heads/master'
    });
    
    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: newRef,
        sha: masterBranch.data.object.sha
    });

    await octokit.repos.merge({
        owner: repo.owner,
        repo: repo.repo,
        base: `Chore/Sprint${sprint}`,
        head: 'dev',
        commit_message: 'Merging Dev'
    });
    
    const packageJson = await octokit.repos.getContent({ 
        owner: repo.owner,
        repo: repo.repo,
        path: 'package.json',
        ref: newRef
    });

    await octokit.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.repo,
        path: 'package.json',
        message: `Updating Package Version to ${newJson.version}`,
        content: Buffer.from(JSON.stringify(newJson, undefined, 4)).toString('base64'),
        sha: packageJson.data.sha,
        committer: {
            name: process.env.GITHUB_ACTOR,
            email: `${process.env.GITHUB_ACTOR}@users.noreply.github.com`,
        },
        author: {
            name: process.env.GITHUB_ACTOR,
            email: `${process.env.GITHUB_ACTOR}@users.noreply.github.com`,
        },
        branch: `Chore/Sprint${sprint}`
    });

    const pr = await octokit.pulls.create({
      owner: repo.owner,
      repo: repo.repo,
      head: `Chore/Sprint${sprint}`,
      base: 'master',
      title: `Chore/Sprint${sprint}`
    });

    const merge = await octokit.pulls.merge({
        owner: repo.owner,
        repo: repo.repo,
        pull_number: pr.data.number
    });

    await octokit.git.deleteRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: newRef
    });

    await octokit.git.createTag({
        owner: repo.owner,
        repo: repo.repo,
        object: merge.data.sha,
        message: releaseNotes,
        tag: `v${sprint}`,
        type: 'commit'
    });

    return newJson.version;
};

pushReleaseVersion()
.then((version) => {
    core.info(`Successfully Released Package Version: ${version}`);
})
.catch((err) => {
    core.error(err);
    core.setFailed(core.error);
});