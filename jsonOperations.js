const actions = require('./actions');
const semver = require('semver');

const updateVersion = (content) => {
    const packageJson = JSON.parse(content);

    const level = action == actions.types.Release ? 'minor' : 'patch';
    packageJson.version = semver.inc(packageJson.version, level);

    return packageJson;
}

exports.updateVersion = updateVersion;