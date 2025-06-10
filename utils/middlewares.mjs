import {mockUsers} from "../utils/constants.mjs";

export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} request to ${request.url}`);
    next(); // call the next middleware or route handler
};

export const resolveIndexById = (request, response, next) => {
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
