import { Router } from "express";

const router = Router();

router.get('/api/products', (request, response) => {
    response.send([{id:123, name: 'GTA VI'},
                    {id:456, name: 'RDR3'}
        ]);
    });

export default router;
