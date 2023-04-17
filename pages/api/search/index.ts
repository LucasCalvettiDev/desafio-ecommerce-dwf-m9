import type { NextApiRequest, NextApiResponse } from "next";
import { searchProductsPaginated } from "controllers/products";
import method from "micro-method-router";

export async function getProductsPaginated(req: NextApiRequest, res: NextApiResponse) {
    const results = await searchProductsPaginated(req);
    res.send({
        results: results.products,
        pagination: {
            offset: results.offset,
            limit: results.limit,
            total: results.products.numberOfProductsFound,
        },
    });
}

const handler = method({
    get: getProductsPaginated,
});

export default handler;
