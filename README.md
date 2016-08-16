
## Server
In the server directory, run:
```
$ npm start
```

## Testing
In the client directory, run:
```
$ grunt test
```

## Development DB 
From root directory, e.g. *not* /client.
```
$ mongod --dbpath data/db/ --logpath data/logs/mongodb.log --logappend
```

## SSL Certs Guide
[How to](http://www.joshwright.com/tips/setup-a-godaddy-ssl-certificate-on-heroku)

## Deploy

Make a production branch at github and go to embeditor-production.
``` 
$ cd embeditor
$ git pull
$ git checkout production
$ mv ../temp/node_modules client
$ cd client
$ grunt build
$ (cd back to embeditor)
$ git add -A
$ git commit -a -m 'Compiled assets: <date>'
$ git push git push -f heroku production:master
$ git checkout master
$ git branch -D production
$ git push origin --delete production
```
