start /WAIT /b git push --delete origin gh-pages
Pushd dist
start /WAIT /b git init
start /WAIT /b git remote add origin git@github.com:chansssss/id-photo.git
start /WAIT /b git add . -A
start /WAIT /b git commit -m'deploy'
start /WAIT /b git checkout -b gh-pages
start /WAIT /b git push --set-upstream origin gh-pages
