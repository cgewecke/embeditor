#!/bin/bash
rm -r garbage/client
cd embeditor
git pull
git checkout production
mv ../temp/node_modules client
cd client
grunt build
cd ../../embeditor
git add -A
git commit -a -m 'Compiled Assets'
git push -f heroku production:master
git checkout master
git branch -D production
git push origin --delete production
cd ..
