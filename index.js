const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');
const github = require('@actions/github');

const actionType = core.getInput('action-type');
const token = core.getInput('github_token');
const sprint = core.getInput('sprint');
const octokit = github.getOctokit(token);
const repo = github.context.repo;

const pushReleaseVersion = async () => {
    const newJson = ops.updateVersion(actionType, process.cwd());

    const masterBranch = await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: 'heads/master'
    });
    
    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: `refs/heads/Chore/Sprint${sprint}`,
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
        ref: `refs/heads/Chore/Sprint${sprint}`
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

    await octokit.pulls.create({
      owner: repo.owner,
      repo: repo.repo,
      head: `Chore/Sprint${sprint}`,
      base: 'master',
    });

    return newJson.version;
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