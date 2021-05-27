#!/bin/bash

echo The package-lock file was changed on this commit!
# Stop the process if it's running.
pm2 stop -s orion || :
echo Bot stopped. Nuking and reinstalling the dependencies...
npm ci --unsafe-perm=true --allow-root
echo Dependencies reinstalled successfully! Restarting...
pm2 start ecosystem.config.js
