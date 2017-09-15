@echo off
@setlocal enableextensions enabledelayedexpansion

:: The variables
set "spaces=                                           "
set "line=TEST FILE%spaces%"
set "line=%line:~0,26%LAST MODIFIED%spaces%"
set "line=%line:~0,45%STATUS"
echo %line%

:: Pre-starting some commands
start mongod

:: The scripts
call :run specs\test_404.js
call :run specs\test_api.js
call :run specs\test_assets.js
call :run specs\test_hash.js
call :run specs\test_helper.js
call :run specs\test_jnode.js
call :run specs\test_locales.js
call :run specs\test_logger.js
call :run specs\test_model.js
call :run specs\test_mongo.js
call :run specs\test_mysql.js
call :run specs\test_plugin.js
call :run specs\test_policy.js
call :run specs\test_promise.js
call :run specs\test_redirect.js
call :run specs\test_scheduler.js
call :run specs\test_validator.js
call :run specs\test_view.js

goto:eof

:: The functions
:run
for %%? in (%~1) do (
	set filedata=%%~t?
	set filesize=%%~z?
)
set "line=%~1%spaces%"
set "line=%line:~0,26%%filedata%%spaces%"
set "line=%line:~0,45%"
echo|set /p="%line%"
for /f %%i in ('node %~1') do (
	echo.%%i| find /i "error" > nul &&  (
		echo ERROR
		echo ^> %%i
		goto:eof
	)
)
if errorlevel 0 (
	echo Success
) else (
	echo ERROR
)
goto:eof
endlocal
