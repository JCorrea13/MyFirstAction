ls .
cd /github/workspace
node /updatePackageVersion.js $1
echo "Releasing: $1"