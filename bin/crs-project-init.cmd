@ECHO OFF
SETLOCAL
SET "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%crs-project-init.js" %*
EXIT /B %ERRORLEVEL%
