#!/usr/bin/env bash

set -e

FRONTEND_DIR="camunda-frontend"
SERVER_DIR="tomcat-server"
EXTRACTOR_DIR="event-log-extractor"
BUILD_DIR="$FRONTEND_DIR/target/webapp/app"
TARGET_DIR="$SERVER_DIR/server/apache-tomcat-10.1.30/webapps/camunda/app"

cd "$FRONTEND_DIR"

echo "Building frontend..."
npm i --silent
npm run build

cd ..

cd "$EXTRACTOR_DIR"

echo "Building extractor service ..."
npm i --silent
cd ..

if [ ! -d "$BUILD_DIR" ]; then
  echo "Build failed or app folder not found!"
  exit 1
fi

rm -rf "$TARGET_DIR"
mv "$BUILD_DIR" "$TARGET_DIR"

echo "Deployment completed successfully!"