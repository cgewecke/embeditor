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

For first deployment, create a separate folder ```embeditor-production``` and segregate it from the main project. This is to minimize damage from things going wildly wrong during the production-build. Then:
```
$ cd embeditor-production
$ mkdir temp && mkdir garbage
$ git clone https://github.com/cgewecke/embeditor.git && cd embeditor
$ heroku git:remote -a <YOUR_APP_NAME e.g. cyclopse> && cd client
$ npm install
$ bower update
$ mv node_modules ../../temp
$ mv bower_components ../../temp
$ mv ../deploy.sh ../.. && cd ../..
$ chmod +x deploy.sh
```

From then on, as long as you haven't made any changes to bower or npm you can deploy in ~45 sec by making a production branch at github, navigating to embeditor-production and running: 
``` 
$ ./deploy.sh
```
