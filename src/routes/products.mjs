import { Router } from "express";

//cookie-parser is a middleware that parses cookies from the request headers


const router = Router();

router.get('/api/products', (request, response) => {
    // headers are used to send additional information with the request
    // cookies are used to store data on the client side, so that the server can access it later
    // .cookies sent an undefined error because we didn't use cookie-parser middleware
    // to parse the cookies from the request headers
    //console.log(request.headers.cookies);
    console.log(request.cookies); // this will log the cookies sent in the request headers

    // we can make sure like a 1234 cookie is required to access this route

    if (request.cookies.sessionId && request.cookies.sessionId === '12345') {
        return response.send([{id:123, name: 'GTA VI'},
                    {id:456, name: 'RDR3'}]);
    }
    else {
    return response.status(403).send({msg: "You need correct cookie"});
    }
});

export default router;
