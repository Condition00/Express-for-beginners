import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import { body, matchedData, checkSchema, check } from 'express-validator';
import { createUserValidationSchema } from "../../utils/validationSchemas.mjs";
import { resolveIndexById } from "../../utils/middlewares.mjs"; 


const router = Router();

router.get('/api/users', query('filter').
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

router.get('/',
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

router.post('/api/users',
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

    router.get('/api/users/:id', resolveIndexById, (request, response) => {
        const {findUser} = request; // destructure findUser from request object
        const findUserIndex = mockUsers[findUser]; // findUser is the index of the user in the mockUsers array
        if(!findUserIndex)
            // if the user is not found, we can return a 404 error
            // used resolveIndexById middleware to find the user by id
            return response.status(404).send({msg: "User not found"});
        response.send(findUserIndex);
    // we can use findUserIndex to get the user from the mockUsers array
    });

    //put requests => updates data entirely


    // now we can use the resolveIndexById middleware to find the user by id
    router.put('/api/users/:id', resolveIndexById, (request, response) => {
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
    router.patch('/api/users/:id', resolveIndexById, (request, response) => {
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
    router.delete('/api/users/:id', resolveIndexById, (request, response) => {
        const {findUser} = request;
        mockUsers.splice(findUser, 1); // remove the user from the array
        return response.status(204).send(); // no content
    });

export default router;
