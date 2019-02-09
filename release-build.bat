call npm run build
rmdir /S /Q C:\data\gitrepo\embriosupport-prod-page\dist
move .\dist C:\data\gitrepo\embriosupport-prod-page\dist
cd C:\data\gitrepo\embriosupport-prod-page
call upload.bat

pause .
