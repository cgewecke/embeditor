Heroku Production notes:

Make a production branch at github

In embeditor-production, navigate to root, git pull, checkout production

In the client folder run: $ npm install

In the client folder run: $ bower update (pick Angular 1.3.16 option when asked)

In the client folder run:$ grunt build

In the server, move zeroclipboard.swf into the dist/scripts folder

Move client outside the repo

Move server/node-modules outside the repo

Move everything else out of 'server' folder so that it's in the root.

push to github

$ git add -A

$ git commit -a -m 'Compiled assets '

push to heroku:

git push -f heroku production:master

delete production branch locally, remotely:

$ git checkout master

$ git branch -D production

$ git push origin --delete production



