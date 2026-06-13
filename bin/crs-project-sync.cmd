@ECHO OFF
SETLOCAL
SET "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%crs-project-sync.js" %*
EXIT /B %ERRORLEVEL%
