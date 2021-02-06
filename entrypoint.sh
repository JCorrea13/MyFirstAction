echo "This is root?"
ls .
echo "This is the workspace"
ls /github/workspace
node /updatePackageVersion.js $1
echo "Releasing: $1"