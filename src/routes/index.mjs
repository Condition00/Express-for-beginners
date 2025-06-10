import { Router } from "express";
import usersRouter from "./users.mjs"; // import the users router
import productsRouter from "./products.mjs"; // import the products router

const meow = Router();
meow.use(usersRouter); // use the users router for all routes that start with /api/users
meow.use(productsRouter); // use the products router for all routes that start with /api/products


export default meow; // export the router to be used in the main app file
