(del .\src\public\assets /Q || echo 'init')
mkdir .\src\public\assets\ 2> NUL
copy .\node_modules\govuk-frontend\govuk\all.js .\src\public\assets\
xcopy /E /Q /Y .\node_modules\govuk-frontend\govuk\assets\* .\src\public\assets
xcopy /E /Q /Y .\node_modules\applications-common-hapi\client-side\govuk-timeout\js\* .\src\public\assets