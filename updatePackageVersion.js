const semver = require('./semver');
const fs = require('fs');

const packageJsonPath = './github/workspace/package.json';
const packageJson = require(packageJsonPath);
const versionToRelease = process.argv[2].toLowerCase();

const currentVersion = packageJson.version.split('.');

const major = versionToRelease == semver.levels.Major ? parseInt(currentVersion[0]) + 1 : currentVersion[0];
const minor = versionToRelease == semver.levels.Minor ? parseInt(currentVersion[1]) + 1 : currentVersion[1];
const patch = versionToRelease == semver.levels.Patch ? parseInt(currentVersion[2]) + 1 : currentVersion[2];

packageJson.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 4));