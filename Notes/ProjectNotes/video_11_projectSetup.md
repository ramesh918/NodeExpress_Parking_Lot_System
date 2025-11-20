## Project Setup 

#### Tech Stack
1. Node.js - Programming Language
2. MongoDb - Database
3. Express - Framework


### Applicaiton  Flow 


---> User (web, postman, insoma) --> server.js --> app.js --> routes --> input validtion --> middlewares(options) <--> controller <--> service <--> models <--> DB

#### Packages and UseCase

1. express - webframework 
2. joi - input validation
3. jsonwebtoken - Authentication
4. bcryptjs - hassing password
5. winston, morgon - loggin
6. cors - resource sharing
7. mongoose - ODM for mongoDB databse
8. Error handling and Authorization we will do internale 

### Command for installing all 
`npm install express joi jsonwebtoken bcryptjs  winston morgan cors  mongoose`


### Folder Structure 

parking-lot-system/
│
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB / Mongoose connection
│   │   └── config.js           # Environment variables, constants
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Authentication (JWT)
│   │   ├── role.middleware.js  # Authorization (roles, permissions)
│   │   ├── validate.middleware.js  # Request validation
│   │   └── error.middleware.js     # Error handling middleware
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── vehicle.model.js
│   │   ├── parkingSlot.model.js
│   │   └── ticket.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── parking.controller.js
│   │   └── ticket.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── parking.routes.js
│   │   └── ticket.routes.js
│   │
│   ├── services/
│   │   ├── user.service.js
│   │   ├── parking.service.js
│   │   └── ticket.service.js
│   │
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── parking.validation.js
│   │   └── ticket.validation.js
│   │
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   ├── jwt.js              # JWT generation/verification helpers
│   │   └── response.js         # Standard API response formatter
│   │
│   ├── app.js                  # Express app setup (middlewares, routes)
│   └── server.js               # Server start file
│
├── .env                        # Environment variables
├── package.json
├── .gitignore
└── README.md



