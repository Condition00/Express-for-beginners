# Express.js Tutorial - Detailed Code Notes

This repository contains an Express.js application with detailed examples and explanations for beginners. The codebase demonstrates how to build a RESTful API with Express.js, covering essential concepts with practical implementation.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Core Concepts Explained](#core-concepts-explained)
  - [Express Server Setup](#express-server-setup)
  - [Middleware](#middleware)
  - [Routing](#routing)
  - [HTTP Methods](#http-methods)
  - [Request Validation](#request-validation)
  - [Route Parameters](#route-parameters)
  - [Query Parameters](#query-parameters)
  - [Express Routers](#express-routers)
- [Refactoring for Better Organization](#refactoring-for-better-organization)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [Dependencies](#dependencies)

## Project Overview

This project is a learning resource for Express.js, demonstrating how to create a simple REST API with mock user data. It includes examples of:

- Setting up an Express server
- Creating and using middleware
- Implementing various HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Validating request data
- Handling route and query parameters
- Organizing routes with Express Router

## Project Structure

```
express-tut/
├── src/
│   ├── index.mjs         # Main application file (clean router implementation)
│   ├── oldindex.mjs      # Original implementation before refactoring
│   └── routes/
│       ├── index.mjs     # Combined router module
│       ├── users.mjs     # User routes module
│       └── products.mjs  # Product routes module
├── utils/
│   ├── constants.mjs     # Mock data and constants
│   ├── middlewares.mjs   # Middleware functions
│   └── validationSchemas.mjs  # Data validation schemas
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/express-tut.git
   cd express-tut
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run start:dev
   ```
   This uses nodemon to automatically restart the server when files change.

4. **Run in production mode:**
   ```bash
   npm start
   ```

## Core Concepts Explained

### Express Server Setup

```javascript
// Basic Express server setup
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Our application starts by importing Express and creating an instance of it. We define a port (either from environment variables or defaulting to 3000) and start the server with `app.listen()`.

### Middleware

Middleware functions are functions that have access to the request object, response object, and the next middleware function. They can:

1. Execute code
2. Make changes to the request/response objects
3. End the request-response cycle
4. Call the next middleware

#### Built-in Middleware

```javascript
// Middleware for parsing JSON in request bodies
app.use(express.json());
```

This middleware parses incoming JSON requests and puts the data in `request.body`.

#### Custom Middleware

```javascript
// Custom logging middleware
const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} request to ${request.url}`);
    next(); // Call the next middleware or route handler
};

// Apply middleware globally
app.use(loggingMiddleware);

// Or apply to specific routes
app.get('/path', loggingMiddleware, (request, response) => {
    // Route handler
});
```

Our `loggingMiddleware` logs the HTTP method and URL for each request, then passes control to the next function with `next()`.

#### Middleware Chaining

```javascript
app.get('/',
    (request, response, next) => {
        console.log(`url 1`);
        next();
    },
    (request, response, next) => {
        console.log(`url 2`);
        next();
    },
    (request, response) => {
        response.status(201).send({msg: "Hello World!"});
    }
);
```

This demonstrates how multiple middleware functions can be chained on a single route, executing in sequence.

#### Parameter Validation Middleware

```javascript
const resolveIndexById = (request, response, next) => {
    const {params: {id}} = request;
    const parsedId = parseInt(id);

    if(isNaN(parsedId))
        return response.status(400).send({msg: "Invalid user ID, Bad Request"});

    const findUser = mockUsers.findIndex(user => user.id === parsedId);
    if(findUser === -1)
        return response.status(404).send({msg: "User not found"});

    request.findUser = findUser;
    next();
};
```

This middleware validates and processes ID parameters, attaching the user index to the request object for use in route handlers.

### Routing

Express routes determine how the application responds to client requests to specific endpoints (URLs) and HTTP methods.

#### Basic Route

```javascript
app.get('/', (request, response) => {
    response.status(201).send({msg: "Hello World!"});
});
```

This defines a route that responds to GET requests at the root path with a "Hello World!" JSON message.

### HTTP Methods

Our application implements all standard HTTP methods for a RESTful API:

#### GET - Retrieve Data

```javascript
// Get all users
app.get('/api/users', (request, response) => {
    return response.send(mockUsers);
});

// Get a specific user by ID
app.get('/api/users/:id', resolveIndexById, (request, response) => {
    const {findUser} = request;
    const findUserIndex = mockUsers[findUser];
    response.send(findUserIndex);
});
```

#### POST - Create Data

```javascript
// Create a new user
app.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty())
        return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});
```

#### PUT - Complete Update

```javascript
// Replace all user data
app.put('/api/users/:id', resolveIndexById, (request, response) => {
    const {body, findUser} = request;
    mockUsers[findUser] = { id: mockUsers[findUser].id, ...body};
    return response.status(200).send(mockUsers[findUser]);
});
```

#### PATCH - Partial Update

```javascript
// Update specific user fields
app.patch('/api/users/:id', resolveIndexById, (request, response) => {
    const {body, findUser} = request;
    mockUsers[findUser] = { ...mockUsers[findUser], ...body};
    return response.status(200).send(mockUsers[findUser]);
});
```

#### DELETE - Remove Data

```javascript
// Delete a user
app.delete('/api/users/:id', resolveIndexById, (request, response) => {
    const {findUser} = request;
    mockUsers.splice(findUser, 1);
    return response.status(204).send();
});
```

### Request Validation

We use `express-validator` to validate request data:

```javascript
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';

// Validate query parameters
app.get('/api/users',
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Filter must be a non-empty string')
        .isLength({ min: 3, max: 10 })
        .withMessage('Filter must be a string with length between 3 and 10 characters'),
    (request, response) => {
        const result = validationResult(request);
        // Handle validation results
    }
);

// Validate request body using a schema
app.post('/api/users',
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            return response.status(400).send({ errors: result.array() });
        }
        // Process validated data
        const data = matchedData(request);
        // ...
    }
);
```

Our validation schema for user creation:

```javascript
// utils/validationSchemas.mjs
export const createUserValidationSchema = {
    name: {
        isLength: {
            options: { min: 5, max: 32 },
            errorMessage: 'Name must be between 1 and 32 characters long.',
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty.',
        },
        isString: {
            errorMessage: 'Name must be a string.',
        },
    },
    displayName: {
        isLength: {
            options: { min: 3, max: 32 },
            errorMessage: 'Display name must be between 1 and 32 characters long.',
        },
        notEmpty: {
            errorMessage: 'Display name cannot be empty.',
        },
        isString: {
            errorMessage: 'Display name must be a string.',
        },
    },
};
```

### Route Parameters

Route parameters are named URL segments used to capture values at specific positions in the URL:

```javascript
// :id is a route parameter
app.get('/api/users/:id', resolveIndexById, (request, response) => {
    // Access the parameter via request.params.id
    const {findUser} = request;
    const findUserIndex = mockUsers[findUser];
    response.send(findUserIndex);
});
```

In this example, `:id` in the route path captures any value at that position in the URL.

### Query Parameters

Query parameters are key-value pairs appended to the URL after a question mark:

```javascript
app.get('/api/users', (request, response) => {
    const { query: { filter, value } } = request;

    if (filter && value) {
        return response.send(
            mockUsers.filter(user => user[filter].includes(value))
        );
    }

    return response.send(mockUsers);
});
```

Example URL with query parameters: `/api/users?filter=name&value=J`

### Express Routers

Express Routers allow you to modularize your routes and create reusable route handlers. This is particularly useful as your application grows, helping you organize routes by resource or functionality.

#### Basic Router Implementation

```javascript
// src/routes/users.mjs
import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";

const router = Router();

// Define routes on the router
router.get('/api/users', query('filter')
    .isString()
    .notEmpty()
    .withMessage('Filter must be a non-empty string')
    .isLength({ min: 3, max: 10 })
    .withMessage('Filter must be a string with length between 3 and 10 characters'),
    (request, response) => {
        // Route handler logic
        const result = validationResult(request);
        const { query: { filter, value } } = request;

        if (filter && value) {
            // Filter users based on query parameters
        }

        return response.send(mockUsers);
    });

export default router;
```

#### Resource-Specific Routers

The project organizes routes by resource type:

```javascript
// src/routes/products.mjs
import { Router } from "express";

const router = Router();

router.get('/api/products', (request, response) => {
    response.send([{id:123, name: 'GTA VI'},
                    {id:456, name: 'RDR3'}]);
});

export default router;
```

#### Combining Multiple Routers

For better organization, we can import and use multiple routers in the main application:

```javascript
// src/routes/index.mjs
import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";

const router = Router();

// Combine all routers into a single router
router.use(usersRouter);
router.use(productsRouter);

export default router;
```

#### Using the Combined Router in the Main Application

```javascript
// src/index.mjs
import express from 'express';
import router from './routes/index.mjs';

const app = express();
app.use(express.json());

// Use the combined router for all routes
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This approach offers several benefits:
- **Separation of concerns**: Each resource has its own dedicated file
- **Code organization**: Routes are grouped logically by function
- **Maintainability**: Easier to locate and modify specific routes
- **Scalability**: New resources can be added without cluttering the main file
- **Reusability**: Router modules can be reused across different applications

## Refactoring for Better Organization

The codebase has evolved from a monolithic approach (all routes in one file) to a modular structure. Here's how the code was refactored:

### Before Refactoring (oldindex.mjs)

In the original implementation, all routes and middleware were defined in a single file:

```javascript
// All routes in one file
app.get('/api/users', (request, response) => { /* ... */ });
app.get('/api/users/:id', (request, response) => { /* ... */ });
app.post('/api/users', (request, response) => { /* ... */ });
app.put('/api/users/:id', (request, response) => { /* ... */ });
app.patch('/api/users/:id', (request, response) => { /* ... */ });
app.delete('/api/users/:id', (request, response) => { /* ... */ });
app.get('/api/products', (request, response) => { /* ... */ });
```

### After Refactoring

#### 1. Middleware Extraction (utils/middlewares.mjs)

Common middleware functions were moved to a dedicated file:

```javascript
// utils/middlewares.mjs
export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} request to ${request.url}`);
    next();
};

export const resolveIndexById = (request, response, next) => {
    // ID validation logic
    // ...
    next();
};
```

#### 2. Resource-Specific Routes (routes/users.mjs, routes/products.mjs)

Routes were organized by resource type:

```javascript
// routes/users.mjs
const router = Router();

router.get('/api/users', /* ... */);
router.post('/api/users', /* ... */);
router.get('/api/users/:id', /* ... */);
router.put('/api/users/:id', /* ... */);
router.patch('/api/users/:id', /* ... */);
router.delete('/api/users/:id', /* ... */);

export default router;

// routes/products.mjs
const router = Router();

router.get('/api/products', /* ... */);

export default router;
```

#### 3. Router Combination (routes/index.mjs)

A central router file combines all resource routers:

```javascript
// routes/index.mjs
import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";

const router = Router();
router.use(usersRouter);
router.use(productsRouter);

export default router;
```

#### 4. Clean Main File (index.mjs)

The main application file is now simplified:

```javascript
// index.mjs
import express from 'express';
import router from './routes/index.mjs';

const app = express();
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

This refactoring demonstrates how a growing Express application can be organized to maintain code quality and scalability.

## API Endpoints

| Method | Endpoint | Description | Location |
|--------|----------|-------------|----------|
| GET | / | Returns a "Hello World" message | routes/users.mjs |
| GET | /api/users | Returns all users (can be filtered) | routes/users.mjs |
| GET | /api/users/:id | Returns a specific user by ID | routes/users.mjs |
| POST | /api/users | Creates a new user | routes/users.mjs |
| PUT | /api/users/:id | Completely updates a user | routes/users.mjs |
| PATCH | /api/users/:id | Partially updates a user | routes/users.mjs |
| DELETE | /api/users/:id | Deletes a user | routes/users.mjs |
| GET | /api/products | Returns a list of products | routes/products.mjs |

## Dependencies

- **express**: Web framework for Node.js
- **express-validator**: Middleware for validating request data
- **nodemon** (dev): Utility for auto-restarting the server during development

To install dependencies:

```bash
npm install
```

---

This Express.js tutorial project demonstrates fundamental concepts for building RESTful APIs. The codebase is heavily commented to explain each concept clearly, making it perfect for beginners learning Express.js.
