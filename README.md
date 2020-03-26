# GoNatours

### About the project:

A RESTful API built with Node.js using MongoDB.

### Built With:

* JavaScript
* Node.js
* MongoDB
* Payment with Stripe
* Deployed on Heroku

### Documentation:

* https://bit.ly/3dyIi1G

### Deployment:

* https://gonatours.herokuapp.com/

##### Dependecies:

    "author": "Eduardo Marcos",
     "license": "ISC",
     "dependencies": {
       "@babel/polyfill": "^7.8.7",
       "axios": "^0.19.2",
       "bcryptjs": "^2.4.3",
       "body-parser": "^1.19.0",
       "compression": "^1.7.4",
       "cookie-parser": "^1.4.5",
       "cors": "^2.8.5",
       "dotenv": "^8.2.0",
       "express": "^4.17.1",
       "express-mongo-sanitize": "^1.3.2",
       "express-rate-limit": "^5.1.1",
       "helmet": "^3.21.3",
       "hpp": "^0.2.3",
       "html-to-text": "^5.1.1",
       "jsonwebtoken": "^8.5.1",
       "m": "^1.5.6",
       "mongoose": "^5.8.4",
       "morgan": "^1.9.1",
       "multer": "^1.4.2",
       "ndb": "^1.1.5",
       "nodemailer": "^6.4.4",
       "pug": "^2.0.4",
       "sharp": "^0.25.2",
       "slugify": "^1.3.6",
       "stripe": "^8.33.0",
       "validator": "^12.2.0",
       "xss-clean": "^0.1.1"
     },
     "devDependencies": {
       "eslint": "^6.8.0",
       "eslint-config-airbnb": "^18.0.1",
       "eslint-config-prettier": "^6.9.0",
       "eslint-plugin-import": "^2.19.1",
       "eslint-plugin-jsx-a11y": "^6.2.3",
       "eslint-plugin-node": "^11.0.0",
       "eslint-plugin-prettier": "^3.1.2",
       "eslint-plugin-react": "^7.17.0",
       "parcel-bundler": "^1.12.4",
       "prettier": "^1.19.1"
     },
     "engines": {
       "node": "^12"
     }
     
##### How to run:
      "name": "natours",
      "version": "1.0.0",
      "description": "learning node, express and mongoDB",
      "main": "app.js",
      "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "start:prod": "NODE_ENV=production nodemon server.js",
      "debug": "ndb server.js",
      "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
      "build:js": "parcel build ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
      
      
#### Screenshots

* Front end design by jonas schmedtmann using Pug templates.

![Captura de Tela_20200326174020](https://user-images.githubusercontent.com/44758312/77696522-47dd2000-6f8c-11ea-81d9-0dfaa9c58a95.png)

![Captura de Tela_20200326174037](https://user-images.githubusercontent.com/44758312/77696533-4ca1d400-6f8c-11ea-98cf-ab7abefec704.png)

![Captura de Tela_20200326174046](https://user-images.githubusercontent.com/44758312/77696537-4e6b9780-6f8c-11ea-8d8f-838dbad33cd9.png)

![Captura de Tela_20200326174049](https://user-images.githubusercontent.com/44758312/77696541-4f9cc480-6f8c-11ea-9160-8ca82cf816eb.png)

![Captura de Tela_20200326174053](https://user-images.githubusercontent.com/44758312/77696546-51668800-6f8c-11ea-9234-091e8b57e0f9.png)

![Captura de Tela_20200326174058](https://user-images.githubusercontent.com/44758312/77696548-53304b80-6f8c-11ea-98db-e7975265205f.png)

![Captura de Tela_20200326174103](https://user-images.githubusercontent.com/44758312/77696550-54617880-6f8c-11ea-9e25-644efe827cc7.png)

![Captura de Tela_20200326174112](https://user-images.githubusercontent.com/44758312/77696554-5592a580-6f8c-11ea-89e4-7a16475c0363.png)

![Captura de Tela_20200326174121](https://user-images.githubusercontent.com/44758312/77696559-56c3d280-6f8c-11ea-926a-f199d82a852a.png)

![Captura de Tela_20200326174151](https://user-images.githubusercontent.com/44758312/77696563-57f4ff80-6f8c-11ea-8f39-c49642394d07.png)

![Captura de Tela_20200326174203](https://user-images.githubusercontent.com/44758312/77696568-59262c80-6f8c-11ea-9b92-e0609e69dd93.png)

![Captura de Tela_20200326174207](https://user-images.githubusercontent.com/44758312/77696572-5a575980-6f8c-11ea-9f61-2bdd061b2dd4.png)


