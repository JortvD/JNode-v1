@echo off
echo Downloading Dependencies
call npm install --no-save --quiet minami >nul 2>nul
echo Updating the site
jsdoc -c jsdoc.json -u tutorials --readme readme.md >nul 2>nul
