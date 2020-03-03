#!/bin/bash

# IMPORTANT
# ---------
# This is an auto generated file with React CDK.
# Do not modify this file.
# Use `.scripts/user/prepublish.sh instead`.

echo "> Start transpiling"
echo ""
rm -rf ./dist
npx babel --ignore tests,stories ./src --out-dir ./dist
echo ""
echo "> Complete transpiling"

. .scripts/user/prepublish.sh
