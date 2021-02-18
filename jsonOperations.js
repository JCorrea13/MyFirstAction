const actions = require('./actions');
const semver = require('semver');

const updateVersion = (action, cwd) => {
    const packageJsonPath = `${cwd}/package.json`;
    const packageJson = require(packageJsonPath);

    const level = action == actions.types.Release ? 'minor' : 'patch';
    packageJson.version = semver.inc(packageJson.version, level);

    return packageJson;
}

exports.updateVersion = updateVersion;