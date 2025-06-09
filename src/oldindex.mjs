import express, { request } from 'express';
// body function is used to validate the body of the request
import { query, validationResult, body, matchedData, checkSchema, check } from 'express-validator'; // import query from express-validator to validate query parameters
// functions imported are used as middleware to validate the request data
// express-validator is a middleware for validating data in express.js
const app = express();
//middleware for post req
app.use(express.json())

import {createUserValidationSchema} from '../utils/validationSchemas.mjs'; // import the validation schemas from the utils folder

// import router

import usersRouter from './routes/users.mjs'; // import the users router

app.use(usersRouter); // use the users router for all routes that start with /api/users

//middleware must be registered before the routes
//middleware is a function that has access to the request, response and next function
const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} request to ${request.url}`);
    next(); // call the next middleware or route handler
};

// since the logic for put patch and delete is the same for all routes, we can use the middleware for all routes

const resolveIndexById = (request, response, next) => {
    //removed body from the request because we are not using it in this middleware
    // const {body} = request; // we can use body if we want to validate the body in the middleware
    const {params: {id}} = request;
        const parsedId = parseInt(id);

        if(isNaN(parsedId))
            return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        const findUser = mockUsers.findIndex(user => user.id === parsedId);
        if(findUser === -1) // if the user is not found (-1)
            return response.status(404).send({msg: "User not found"});
        request.findUser = findUser; // add the index of the user to the request object
        // now we can use this index in the route handler
        next(); // call the next middleware or route handler
};

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
    app.get('/',
        //midlleware a will be called first and we will have option to call middleware b
        //middleware a
        // all the middleware functions are called in the order they are defined
        (request, response, next) => {
            console.log(`url 1`);
            next(); // call the next middleware or route handler
        },
        (request, response, next) => {
            console.log(`url 2`);
            next(); // call the next middleware or route handler
        },
        (request, response, next) => {
            console.log(`url 3`);
            next(); // call the next middleware or route handler
        },
        (request, response, next) => {
            console.log(`url 4`);
            next(); // call the next middleware or route handler
        },
        //middleware b
         (request, response) => {
    response.status(201).send({msg: "Hello World!"});
    });

    // Server is running on port 3000
        // url 1
        // url 2
        // url 3
        // url 4

// we have to remove this endpoint because we are using the users router
    app.get('/api/users', query('filter').
    isString()
    .notEmpty()
    .withMessage('Filter must be a non-empty string')
    .isLength({ min: 3, max: 10 })
    .withMessage('Filter must be a string with length between 3 and 10 characters'),

     (request, response) => {
        // these functions do not throw errors, they just validate the data we have to manage the errors ourselves
        //console.log(request); // request object contains the query parameters


        // validationResult is a function that returns the result of the validation
        // when we pass a ?filter and value query parameter, it will validate the data
        // if the data is valid, it will return an empty array.
        const result = validationResult(request);
        console.log(result);
        console.log(request.query);
        const{ query: { filter, value },
        } = request;
        // when filter and value are undefined, it means no query parameters were passed
        // we can do this or if the next if else fails then we can return all users
        // if (!filter && !value) return response.send(mockUsers);
        if (filter && value) return response.send(
            //filters with value as a substring
            mockUsers.filter(user => user[filter].includes(value))
        );

        return response.send(mockUsers);
    });

    app.use(loggingMiddleware, (request, response,next) =>{
        console.log(`Middleware for all routes after this point`);
        next(); // call the next middleware or route handler
    }); // uses the middleware for routes after this point


    //post requests: http requests that send data to the server
    //right before post we have to have a middleware that parses the json
    app.post('/api/users',
        // putting both in an array
        // [ body('name').notEmpty().withMessage('Name is required').isLength({ min: 5, max: 30 }).withMessage('Name must be a string with length between 5 and 30 characters').isString().withMessage('Name must be a string'),

        // body('displayName').notEmpty().withMessage('Display Name is required').isLength({ min: 3, max: 20 }).withMessage('Display Name must be a string with length between 3 and 20 characters').isString().withMessage('Display Name must be a string'), ],

        // we can use schemas to replace this lengthy validation



    // we can use schemas to replace this lengthy validation ---> [ new file ]

     checkSchema(createUserValidationSchema),
     (request, response) => {
        console.log(request.body);
        // request.body contains the data sent in the request body
        //destructure body from request object


        // validation
        const result = validationResult(request);
        console.log(result);
        // we can check if there are any validation errors
        //.isEmpty() checks if the result is empty
        if (!result.isEmpty()) return response.status(400).send({
            errors: result.array() // return the errors as an array
        });

        // we have to save the user to the database
        // since we are using a mock database, we will just push the user to the array

        const data = matchedData(request); // get the validated data from the request
       // console.log(data); // data contains the validated data

        // data is recommended to be used instead of request.body because it contains only the validated data

        // if we use request.body, it will contain all the data sent in the request body, even the invalid data
            // const {body} = request;
            // //dbs are responsible for the ids but since we dont have one yet we will take the last id and add 1 to it.
            // const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};//spreader operator
            // mockUsers.push(newUser)
            // return response.send(newUser).status(201);

        //dbs are responsible for the ids but since we dont have one yet we will take the last id and add 1 to it.
        const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data};//spreader operator
        mockUsers.push(newUser)
        return response.send(newUser).status(201);
    });
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

    app.get('/api/users/:id', resolveIndexById, (request, response) => {
    const {findUser} = request; // destructure findUser from request object
    const findUserIndex = mockUsers[findUser]; // findUser is the index of the user in the mockUsers array
    if(!findUserIndex)
        // if the user is not found, we can return a 404 error
        // used resolveIndexById middleware to find the user by id
        return response.status(404).send({msg: "User not found"});
    response.send(findUserIndex);
    // we can use findUserIndex to get the user from the mockUsers array
    });

    app.get('/api/products', (request, response) => {
    response.send([{id:123, name: 'GTA VI'},
                    {id:456, name: 'RDR3'}
        ]);
    });

    //put requests => updates data entirely


    // now we can use the resolveIndexById middleware to find the user by id
    app.put('/api/users/:id', resolveIndexById, (request, response) => {
        const {body, findUser} = request;
        //because we attached findUser to the request object in the resolveIndexById middleware
        // we can now use it in the route handler
        //destructure findUser from request object
        // findUser is the index of the user in the mockUsers array


        // removed params from the request because we already did the parsing in the middleware
        // const parsedId = parseInt(id);

        // if(isNaN(parsedId))
        //     return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        // const findUser = mockUsers.findIndex(user => user.id === parsedId);
        // if(findUser === -1) // if the user is not found (-1)
        //     return response.status(404).send({msg: "User not found"});
        mockUsers[findUser] = { id: mockUsers[findUser].id, ...body}; // update the user with the new data
        return response.status(200).send(mockUsers[findUser]);
    });

    //first the global middleware will be called, then the resolveIndexById middleware will be called
    // then the route handler will be called
    // we can use the resolveIndexById middleware for all put and patch requests


    //patch requests => partially updates data
    app.patch('/api/users/:id', resolveIndexById, (request, response) => {
        const {body, findUser} = request;
        // const parsedId = parseInt(id);

        // if(isNaN(parsedId))
        //     return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        // const findUser = mockUsers.findIndex(user => user.id === parsedId);
        // if(findUser === -1) // if the user is not found (-1)
        //     return response.status(404).send({msg: "User not found"});
        // update the user with the new data, only the fields that are provided in the request
        mockUsers[findUser] = { ...mockUsers[findUser], ...body};
        return response.status(200).send(mockUsers[findUser]);
    });

    //delete requests
    app.delete('/api/users/:id', resolveIndexById, (request, response) => {
        const {findUser} = request;
        mockUsers.splice(findUser, 1); // remove the user from the array
        return response.status(204).send(); // no content
    });

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
