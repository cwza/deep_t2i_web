# Deep_t2i Demo Client Site
> Client side code of https://github.com/cwza/deep_t2i/tree/master/server

## Functionality
* Generate anime face image by machine. You can specify hair color and eye color.
* Generate bird image by machine. You can specify any string that describe the bird.

## Environment Variables
```
REACT_APP_SERVER=mock or dev or prod(mock: no server use local image files, dev: use local dev server, prod: use production server)
REACT_APP_PROD_URL=Your server url
REACT_APP_CHECK_RECAPTCHA=true or false to specify whether to check recaptcha at client side.
REACT_APP_RECAPTCHA_SITEKEY=Your recaptcha site key
```

## Dev
* npm install
* Correctly set up environment variables in .env.local
* npm start

## Deploy to Github page
* Correctly setup environment variables in .env.production
* Set "homepage" in package.json to your github page url
* npm run deploy
