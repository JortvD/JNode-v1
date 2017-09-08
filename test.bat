@echo off

:: The scripts
CALL :run specs\test_404.js
CALL :run specs\test_api.js
CALL :run specs\test_assets.js
CALL :run specs\test_hash.js
CALL :run specs\test_helper.js
CALL :run specs\test_jnode.js
CALL :run specs\test_logger.js
CALL :run specs\test_model.js
CALL :run specs\test_policy.js
CALL :run specs\test_promise.js
CALL :run specs\test_redirect.js
CALL :run specs\test_scheduler.js
CALL :run specs\test_validator.js
CALL :run specs\test_view.js

goto:eof

:: The functions
:run
echo|set /p="%~1: "
node %~1 > nul
IF errorlevel 0 (
	echo 	Success
)
goto:eof
