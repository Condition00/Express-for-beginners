import express, { request } from 'express';
import cookieParser from 'cookie-parser'; // import cookie-parser to handle cookies
import meow from './routes/index.mjs';
const app = express();

app.use(express.json())
app.use(cookieParser()); // use cookie-parser middleware to parse cookies from request headers
app.use(meow);

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
