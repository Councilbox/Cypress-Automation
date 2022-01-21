#!/bin/bash
BUILD_FINAL_DIRECTORY="build_final"
BUILD_DIRECTORY="build"

# Delete build directory

sudo rm -R -f "$BUILD_DIRECTORY" &&

# Create react build
yarn build &&

sudo rm -R -f "$BUILD_FINAL_DIRECTORY" &&

mv "$BUILD_DIRECTORY" "$BUILD_FINAL_DIRECTORY" &&
echo "Deploy done!"