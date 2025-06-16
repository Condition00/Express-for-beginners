import express, { request } from 'express';
import cookieParser from 'cookie-parser'; // import cookie-parser to handle cookies
import meow from './routes/index.mjs';
import { mockUsers } from '../utils/constants.mjs';
import session from 'express-session'; // import express-session to handle sessions
import passport from 'passport'; // import passport for authentication
// passport will take care of mapping the session id to the user in our application



const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(session({
    secret: 'zero',
    saveUninitialized: false, // dont save unmodified sessions. take up bunch of memory
    resave: false, // dont save session if it has not been modified
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport session middleware to handle sessions
// actually take care of attaching a dynamic user property to the request object, which will be used to identify the user in our application



// modifing session data object

app.use(meow);
 // use express-session middleware to handle sessions

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//http cookies

// by default http is stateless, meaning that each request is independent of the previous one
// cookies are used to store data on the client side, so that the server can access it later

// router.get('/',
//             //midlleware a will be called first and we will have option to call middleware b
//             //middleware a
//             // all the middleware functions are called in the order they are defined
//             (request, response, next) => {
//                 console.log(`url 1`);
//                 next(); // call the next middleware or route handler
//             },
//             (request, response, next) => {
//                 console.log(`url 2`);
//                 next(); // call the next middleware or route handler
//             },
//             (request, response, next) => {
//                 console.log(`url 3`);
//                 next(); // call the next middleware or route handler
//             },
//             (request, response, next) => {
//                 console.log(`url 4`);
//                 next(); // call the next middleware or route handler
//             },
//             //middleware b
//              (request, response) => {
//         response.status(201).send({msg: "Hello World!"});
//         });

//         // Server is running on port 3000
//             // url 1
//             // url 2
//             // url 3
//             // url 4

// signed cookies need a secret
// app.use(cookieParser('mySecret'));
// response.cookie('sessionId', '12345', {
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//     signed: true // this will sign the cookie with the secret
// });

app.get('/', (request, response) => {
        console.log(request.session);
        console.log(request.sessionID);

        request.session.visited = true; // we can actually track a user now cuz sesID remains the same

        response.cookie('sessionId', '12345', {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });
        response.status(201).send({msg: "Hello World!"});
});

        // Server is running on port 3000
            // url 1
            // url 2
            // url 3
            // url 4


            //3:00:00


//sessions:
// sessions are used to store data on the server side, so that the server can access it later
// sessions are usually stored in memory, but can also be stored in a database or a file

// often used for user authentication, where the server stores the user's information in a session and sends a session ID to the client as a cookie
// the client sends the session ID back to the server with each request, so that the server can access the user's information


// fake authentication system - how we can map a single session id to a user in our application

app.post('/api/auth', (request, response) => {
    const {body: {name, password},
    } = request;
    const findUser = mockUsers.find(user => user.name === name);
    if (!findUser || findUser.password !== password) {
        return response.status(401).send({msg: 'Invalid credentials'});
    }
    // main purpose of this endpoint is to modify the session object because we want to stop generating new session ids, we want generate a session id only once when the user logs set the cookie and the send the cookie back to the client or browser. so when the client sends another request, the session id will be the same and we can use it to identify the user.

    request.session.user = findUser; // store the user in the session object
    return response.status(200).send({
        msg: 'User authenticated successfully',
        user: {
            id: findUser.id,
            name: findUser.name,
            displayName: findUser.displayName
        }
    });
});

app.get('/api/auth/status', (request, response) => {
    request.sessionStore.get(request.session.id, (err, session) => {
        if (err) {
            console.error('Error retrieving session:', err);
            return response.status(500).send({msg: 'Internal server error'});
        }
        console.log('Session data:', session);
    });
    // check if the user is authenticated by checking if the user is present in the session object
    if (request.session.user) {
        return response.status(200).send({
            msg: 'User is authenticated',
            user: request.session.user // display the user information stored in the session
        });
    }
    return response.status(401).send({msg: 'User is not authenticated'});
});

// expample cart system so user can add items only if they are authenticated

app.post('/api/cart', (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    // the next thhing we want to do if the cart exists on the session object, we want to add the item to the cart, if it does not exist, we want to create a new cart and add the item to it.

    const {body: item} = request;
    const { cart } = request.session; // destructure cart from session object, if it does not exist, set it to an empty array

    if (cart) {
        cart.push(item); // add the item to the cart
    } else {
        request.session.cart = [item]; // create a new cart and add the item to it
    }

    return response.status(201).send(item);

});

app.get('/api/cart', (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    // check if the user is authenticated by checking if the user is present in the session object
    return response.send(request.session.cart ?? []); // if the cart does not exist, return an empty array
});

// each client has a unique session id, which is stored in a cookie on the client side
// so each user has his own unique session id, which is used to identify the user and store their information on the server side



//passportjs
