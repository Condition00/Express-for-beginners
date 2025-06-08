import express, { request } from 'express';
const app = express();
//middleware for post req
app.use(express.json())

//middleware must be registered before the routes
//middleware is a function that has access to the request, response and next function
const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} request to ${request.url}`);
    next(); // call the next middleware or route handler
};

// since the logic for put patch and delete is the same for all routes, we can use the middleware for all routes

const resolveIndexById = (request, response, next) => {
    const {body, params: {id}} = request;
        const parsedId = parseInt(id);

        if(isNaN(parsedId))
            return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        const findUser = mockUsers.findIndex(user => user.id === parsedId);
        if(findUser === -1) // if the user is not found (-1)
            return response.status(404).send({msg: "User not found"});
};

//app.use(loggingMiddleware); // use the middleware for all routes globaly

const PORT = process.env.PORT || 3000;

//localhost:3000
//localhost:3000/users
//localhost:3000/products

//Get Requests:
    const mockUsers = [
        {id: 1, name: 'John Doe', displayName: 'John'},
        {id: 2, name: 'Jane Doe', displayName: 'Jane'},
        {id: 3, name: 'Alice Smith', displayName: 'Alice'},
        {id: 4, name: 'Bob Johnson', displayName: 'Bob'},
        {id: 5, name: 'Charlie Brown', displayName: 'Charlie'},
        {id: 6, name: 'Diana Prince', displayName: 'Diana'},
        {id: 7, name: 'Ethan Hunt', displayName: 'Ethan'},
        {id: 8, name: 'Fiona Gallagher', displayName: 'Fiona'},
        {id: 9, name: 'George Miller', displayName: 'George'},
        {id: 10, name: 'Hannah Baker', displayName: 'Hannah'}
    ];
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

    app.get('/api/users', (request, response) => {
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
    app.post('/api/users', (request, response) => {
        console.log(request.body);
        //destructure body from request object
        const {body} = request;
        //dbs are responsible for the ids but since we dont have one yet we will take the last id and add 1 to it.
        const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};//spreader operator
        mockUsers.push(newUser)
        return response.send(newUser).status(201);
    });

    app.get('/api/users/:id', (request, response) => {
    const parsedId = parseInt(request.params.id);
    console.log(parsedId);
    if(isNaN(parsedId))
        return response.status(400).send({msg: "Invalid user ID, Bad Request"});

    const findUser = mockUsers.find(user => user.id === parsedId);
    if(!findUser)
        return response.status(404).send({msg: "User not found"});
    response.send(findUser);
    });

    app.get('/api/products', (request, response) => {
    response.send([{id:123, name: 'GTA VI'},
                    {id:456, name: 'RDR3'}
        ]);
    });

    //put requests => updates data entirely

    app.put('/api/users/:id', (request, response) => {
        const {body, params: {id}} = request;
        const parsedId = parseInt(id);

        if(isNaN(parsedId))
            return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        const findUser = mockUsers.findIndex(user => user.id === parsedId);
        if(findUser === -1) // if the user is not found (-1)
            return response.status(404).send({msg: "User not found"});
        mockUsers[findUser] = { id: parsedId, ...body}; // update the user with the new data
        return response.status(200).send(mockUsers[findUser]);
    });

    //patch requests => partially updates data
    app.patch('/api/users/:id', (request, response) => {
        const {body, params: {id}} = request;
        const parsedId = parseInt(id);

        if(isNaN(parsedId))
            return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        const findUser = mockUsers.findIndex(user => user.id === parsedId);
        if(findUser === -1) // if the user is not found (-1)
            return response.status(404).send({msg: "User not found"});
        // update the user with the new data, only the fields that are provided in the request
        mockUsers[findUser] = { ...mockUsers[findUser], ...body};
        return response.status(200).send(mockUsers[findUser]);
    });

    //delete requests
    app.delete('/api/users/:id', (request, response) => {
        const {params: {id}} = request;
        const parsedId = parseInt(id); // parseInt converts the string to a number

        if(isNaN(parsedId))
            return response.status(400).send({msg: "Invalid user ID, Bad Request"});
        const findUser = mockUsers.findIndex(user => user.id === parsedId);
        if(findUser === -1) // if the user is not found (-1)
            return response.status(404).send({msg: "User not found"});
        mockUsers.splice(findUser, 1); // remove the user from the array
        return response.status(204).send(); // no content
    });

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
