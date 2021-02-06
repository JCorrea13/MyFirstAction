#!/bin/sh -l

node /updatePackageVersion.js $1
echo "Releasing: $1"

git --version
git branch