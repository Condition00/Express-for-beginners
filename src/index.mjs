import express, { request } from 'express';
import cookieParser from 'cookie-parser'; // import cookie-parser to handle cookies
import meow from './routes/index.mjs';
import session from 'express-session'; // import express-session to handle sessions
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
