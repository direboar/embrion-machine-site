call npm run build
rmdir /S /Q D:\data\gitrepo\embriosupport-dev-page\dist
move .\dist D:\data\gitrepo\embriosupport-dev-page\dist
cd D:\data\gitrepo\embriosupport-dev-page
call upload.bat

pause .
