import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";


const router = Router();

// router.get('/api/users', query('filter').
//     isString()
//     .notEmpty()
//     .withMessage('Filter must be a non-empty string')
//     .isLength({ min: 3, max: 10 })
//     .withMessage('Filter must be a string with length between 3 and 10 characters'),

//      (request, response) => {
//         const result = validationResult(request);
//         console.log(result);
//         console.log(request.query);
//         const{ query: { filter, value },
//         } = request;
//         if (filter && value) return response.send(
//             mockUsers.filter(user => user[filter].includes(value))
//         );

//         return response.send(mockUsers);
//     });

    export default router;
