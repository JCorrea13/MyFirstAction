const fs = require('fs');

const packageJsonPath = '/github/workspace/package.json';
const packageJson = require(packageJsonPath);
packageJson.version = process.argv[2];

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 4));