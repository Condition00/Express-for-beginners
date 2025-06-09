import express, { request } from 'express';
// body function is used to validate the body of the request
 // import query from express-validator to validate query parameters
// functions imported are used as middleware to validate the request data
// express-validator is a middleware for validating data in express.js
const app = express();
//middleware for post req
app.use(express.json())

import {createUserValidationSchema} from '../utils/validationSchemas.mjs'; // import the validation schemas from the utils folder

// import router

import usersRouter from './routes/users.mjs'; // import the users router
import productsRouter from "./routes/products.mjs"; // import the products router

app.use(usersRouter);// use the users router for all routes that start with /api/users
app.use(productsRouter); // use the products router for all routes that start with /api/products


//middleware must be registered before the routes
//middleware is a function that has access to the request, response and next function


// since the logic for put patch and delete is the same for all routes, we can use the middleware for all routes



//app.use(loggingMiddleware); // use the middleware for all routes globaly

const PORT = process.env.PORT || 3000;

//localhost:3000
//localhost:3000/users
//localhost:3000/products

//Get Requests:
import {mockUsers} from '../utils/constants.mjs' // import the mock users data from the constants file
// mock users data in separate file

//logging middleware logs it in the base  url
    // app.get('/', loggingMiddleware, (request, response) => {
    // response.status(201).send({msg: "Hello World!"});
    // });

// we have to remove this endpoint because we are using the users router

 // uses the middleware for routes after this point


    //post requests: http requests that send data to the server
    //right before post we have to have a middleware that parses the json

    // we can do this to any request that takes a request body

    // app.get('/api/users/:id', (request, response) => {
    // const parsedId = parseInt(request.params.id);
    // console.log(parsedId);
    // if(isNaN(parsedId))
    //     return response.status(400).send({msg: "Invalid user ID, Bad Request"});

    // const findUser = mockUsers.find(user => user.id === parsedId);
    // if(!findUser)
    //     return response.status(404).send({msg: "User not found"});
    // response.send(findUser);
    // });

    // app.delete('/api/users/:id', resolveIndexById, (request, response) => {
    //     const {params: {id}} = request;
    //     const parsedId = parseInt(id); // parseInt converts the string to a number

    //     if(isNaN(parsedId))
    //         return response.status(400).send({msg: "Invalid user ID, Bad Request"});
    //     const findUser = mockUsers.findIndex(user => user.id === parsedId);
    //     if(findUser === -1) // if the user is not found (-1)
    //         return response.status(404).send({msg: "User not found"});
    //     mockUsers.splice(findUser, 1); // remove the user from the array
    //     return response.status(204).send(); // no content
    // });

//Query Parameters:

//localhost:3000/api/users?key=value&key2=value2
//?key=value&key2=value2 => query string & acts as limiter
//query parameters can send value from 1 page to another

//32:50
//localhost:3000/api/users?filter=name&value=J
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//post requests: http requwests that send data to the server

//56:08

//put requests => updates data entirely
// used to update data, replaces the entire resource with the new data
//patch requests => partially updates data
// used to update data, only updates the fields that are provided in the request
//delete requests
// used to delete data, removes the resource from the server

//more http methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods



//middleware: functions that run before the request reaches the route handler
// they can modify the request, response or end the request
// they can be used for logging, authentication, error handling, etc.



//Validation: checking if the data is valid before processing it
// we can use middleware to validate the data before processing it.

// express-validator: a middleware for validating data in express.js
// https://express-validator.github.io/docs/

//npm i express-validator




// ROUTERS IN EXPRESS: reusable pieces of code that can be used to handle routes

// as application grows, we need more routes and we need to organize them
// we can use routers to organize our routes

// we can group user endpoints and product endpoints in different files
