import express, { request } from 'express';

const app = express();

app.use(express.json())

import router from './routes/users.mjs';

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//http cookies

// by default http is stateless, meaning that each request is independent of the previous one
// cookies are used to store data on the client side, so that the server can access it later
