#!/bin/bash
BUILD_FINAL_DIRECTORY="build_final"
BUILD_DIRECTORY="build"

# Delete build directory
if [ -d "$BUILD_DIRECTORY" ]; then
  rm -rf "$BUILD_DIRECTORY" &
fi

# Create react build
yarn build &&

# Delete build_final directory
if [ -d "$BUILD_FINAL_DIRECTORY" ]; then
  rm -rf "$BUILD_FINAL_DIRECTORY" &
fi

mv "$BUILD_DIRECTORY" "$BUILD_FINAL_DIRECTORY" &&
echo "Deploy done!"