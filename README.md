[![Build Status](https://travis-ci.org/cgewecke/embeditor.svg?branch=master)](https://travis-ci.org/cgewecke/embeditor)
## Site
This project is live at [cyclop.se](https://www.cyclop.se)

## Server
From the server directory:
```
$ npm start
```

## Testing
From the client directory:
```
$ grunt test
```

## Development DB 
From the root directory:
```
$ export NODE_ENV=development
$ mongod --dbpath data/db/ --logpath data/logs/mongodb.log --logappend
```
## Development IPad
Local IP address is listed in Network preferences > Status. Typically:
```
http://10.0.0.4:3000
```

## SSL Certs Guide
[How to](http://www.joshwright.com/tips/setup-a-godaddy-ssl-certificate-on-heroku)

## Deploy 

For first deployment, create a separate folder ```embeditor-production``` and segregate it from the main project. This is to minimize damage from things going wildly wrong during the production-build. Then:
```
// Go to production staging folder and create some temp folders
$ cd embeditor-production
$ mkdir temp && mkdir garbage

// Clone embeditor and add Heroku app as a git remote
$ git clone https://github.com/cgewecke/embeditor.git && cd embeditor
$ heroku git:remote -a <YOUR_APP_NAME e.g. cyclopse> && cd client

// Install npm and bower assets
$ npm install
$ bower update

// Move everything to correct position for deployment script
$ mv node_modules ../../temp
$ mv bower_components ../../temp
$ mv ../deploy.sh ../.. && cd ../..
$ chmod +x deploy.sh
```

From then on, as long as you haven't made any changes to bower or npm you can deploy in ~45 sec by making a production branch at github, navigating to embeditor-production and running: 
``` 
$ ./deploy.sh
```
