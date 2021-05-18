#!c:/Program Files/Git/bin/sh.exe

set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:romansj/banano-stats.git master:gh-pages

cd -