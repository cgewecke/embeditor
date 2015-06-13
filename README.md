Heroku Production notes:

1. Make a production branch at github

2. In embeditor-production, navigate to root, git pull, checkout production

  In the client folder run: $ npm install

  In the client folder run: $ bower update (pick Angular 1.3.16 option when asked)
  
  In client/app/styles: rename all .css as .scss

  In the client folder run:$ grunt build

3. In the server, move zeroclipboard.swf into the dist/scripts folder

4. Move client outside the repo

5. Move server/node-modules outside the repo

6. Move everything else out of 'server' folder so that it's in the root.

7. push to github

  $ git add -A

  $ git commit -a -m 'Compiled assets '

8. push to heroku:

  $ git push -f heroku production:master

9. delete production branch locally, remotely:

  $ git checkout master

  $ git branch -D production

  $ git push origin --delete production



