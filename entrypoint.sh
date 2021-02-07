#!/bin/sh -l

node /updatePackageVersion.js $1
echo "Releasing: $1"