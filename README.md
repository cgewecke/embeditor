#embeditor

Heroku Production notes:

1. In the client folder run:$ grunt build

2. In the server, move zeroclipboard.swf into the dist/scripts folder

3. Move client outside the repo

4. Move server/node-modules outside the repo

5. Move everything else out of 'server' folder so that it's in the root.

6. push to github

7. push to heroku: git push heroku production:master

8. delete production branch locally, remotely: 

  $ git checkout master

  $ git branch -D production

  $ git push origin --delete production



