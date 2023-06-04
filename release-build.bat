call npm run build
rmdir /S /Q D:\data\gitrepo\embriosupport-prod-page\dist
move .\dist D:\data\gitrepo\embriosupport-prod-page\dist
cd D:\data\gitrepo\embriosupport-prod-page
call upload.bat

pause .
