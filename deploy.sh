#!/bin/bash
BUILD_FINAL_DIRECTORY="build_final"
BUILD_DIRECTORY="build"

# Delete build directory
if [ -d "$BUILD_DIRECTORY" ]; then
  sudo rm -R -f "$BUILD_DIRECTORY" &
fi

# Create react build
yarn build &&

# Delete build_final directory
if [ -d "$BUILD_FINAL_DIRECTORY" ]; then
  sudo rm -R -f "$BUILD_FINAL_DIRECTORY" &
fi

mv "$BUILD_DIRECTORY" "$BUILD_FINAL_DIRECTORY" &&
echo "Deploy done!"