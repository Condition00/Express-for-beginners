import { Router } from "express";
import usersRouter from "./users.mjs"; // import the users router
import productsRouter from "./products.mjs"; // import the products router

app.use(usersRouter); // use the users router for all routes that start with /api/users
app.use(productsRouter); // use the products router for all routes that start with /api/products


const router = Router();


