# Express Tutorial

This repository contains code and examples for learning [Express.js](https://expressjs.com/), a fast, unopinionated, minimalist web framework for Node.js. It's designed to help beginners understand the core concepts of Express.js through practical examples.

## Concepts Covered

### 1. Basic Express Server Setup
- Setting up a basic Express server
- Configuring port settings
- Understanding the request-response cycle

### 2. HTTP Methods
- **GET**: Retrieving data (examples with `/api/users` and `/api/products`)
- **POST**: Creating new resources (with `/api/users`)
- **PUT**: Complete update of resources (with `/api/users/:id`)
- **PATCH**: Partial update of resources (with `/api/users/:id`)
- **DELETE**: Removing resources (with `/api/users/:id`)

### 3. Middleware
- Custom middleware creation (e.g., `loggingMiddleware`)
- Middleware chaining and execution order
- Route-specific middleware
- Global middleware application
- Middleware for parameter validation (`resolveIndexById`)

### 4. Request Validation
- Using `express-validator` for data validation
- Different validation methods (body, query, params)
- Creating validation schemas
- Handling validation errors
- Using `matchedData` to extract validated data

### 5. Route Parameters
- Using URL parameters (e.g., `/api/users/:id`)
- Parameter extraction and validation
- Building reusable parameter middleware

### 6. Query Parameters
- Handling query strings (e.g., `/api/users?filter=name&value=J`)
- Query parameter validation
- Filtering data based on query parameters

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/express-tut.git
    cd express-tut
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    npm i
    ```

3. **Install express-validator package:**
    ```bash
    npm install express-validator
    ```

4. **Run the server:**
    ```bash
    npm run start:dev
    ```

## Project Structure

```
express-tut/
├── src/
│   └── index.mjs      # Main application file with Express server and routes
├── utils/
│   └── validationSchemas.mjs  # Validation schemas for request data
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Returns a simple "Hello World" message |
| GET | /api/users | Returns all users (can be filtered with query parameters) |
| GET | /api/users/:id | Returns a specific user by ID |
| GET | /api/products | Returns a list of products |
| POST | /api/users | Creates a new user (with validation) |
| PUT | /api/users/:id | Completely updates a user |
| PATCH | /api/users/:id | Partially updates a user |
| DELETE | /api/users/:id | Deletes a user |

## Testing the API

You can use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to test the API endpoints:

```bash
# Get all users
curl http://localhost:3000/api/users

# Filter users by name containing "J"
curl http://localhost:3000/api/users?filter=name&value=J

# Get a specific user
curl http://localhost:3000/api/users/1

# Create a new user
curl -X POST -H "Content-Type: application/json" -d '{"name":"New User","displayName":"NewUser"}' http://localhost:3000/api/users

# Update a user
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated User","displayName":"Updated"}' http://localhost:3000/api/users/1

# Partially update a user
curl -X PATCH -H "Content-Type: application/json" -d '{"displayName":"NewName"}' http://localhost:3000/api/users/1

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## Key Concepts Explained

### Middleware
Middleware functions in Express have access to the request and response objects, and the next middleware function in the application's request-response cycle. They can:
- Execute any code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware function

### Express Validator
This project uses express-validator for validating request data. It provides:
- Field-specific validation
- Custom error messages
- Schema-based validation
- Sanitization of input data

### Request Parameters vs Query Parameters
- **Route Parameters**: Parts of the URL path (e.g., `/api/users/:id`)
- **Query Parameters**: Key-value pairs in the URL after a question mark (e.g., `/api/users?filter=name&value=J`)

## License

This project is licensed under the MIT License.

---

Feel free to contribute or open issues!
