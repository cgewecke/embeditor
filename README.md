[![Build Status](https://travis-ci.org/cgewecke/embeditor.svg?branch=master)](https://travis-ci.org/cgewecke/embeditor)

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
$ export NODE_ENV=development
$ mongod --dbpath data/db/ --logpath data/logs/mongodb.log --logappend
```

## SSL Certs Guide
[How to](http://www.joshwright.com/tips/setup-a-godaddy-ssl-certificate-on-heroku)

## Deploy 
Make a production branch at github, navigate to embeditor-production and run: 
``` 
$ ./deploy.sh
```
