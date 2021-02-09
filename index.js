const core = require('@actions/core');
const simpleGit = require('simple-git');
const ops = require('./jsonOperations');
const github = require('@actions/github');

const actionType = core.getInput('action-type');
const token = core.getInput('github_token');
const octokit = github.getOctokit(token);
const repo = github.context.repo;

const pushReleaseVersion = async () => {
    const newJson = ops.updateVersion(actionType, process.cwd());

    /*const masterBranch = await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: 'heads/master'
    });

    
    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: 'refs/heads/featureA',
        sha: masterBranch.data.object.sha
    });*/
    
    const packageJson = await octokit.repos.getContent({ 
        owner: repo.owner,
        repo: repo.repo,
        path: 'package.json',
        ref: 'refs/heads/featureA'
    });

    core.info(JSON.stringify(packageJson));
    
    octokit.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.repo,
        path: 'packageJson',
        message: `Updating Package Version to ${newJson.version}`,
        content: newJson,
        sha: packageJson.data.sha
    });

    /*await octokit.pulls.create({
      owner: repo.owner,
      repo: repo.repo,
      head: `Chore/ReleaseSprint`,
      base: 'master',
    });*/

    /*await octokit.repos.merge({
        owner: repo.owner,
        repo: repo.repo,
        base: 'master',
        head: 'dev',
        commit_message: `Releasing Version: ${newVersion}`
    });*/

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