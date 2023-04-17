import type { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "controllers/products";
import method from "micro-method-router";
import { ProductResponse } from "lib/customTypes";
import * as yup from "yup";
import { Product } from "models/product";

// ya typié la userData en /me/index.ts, deberia crear una carpeta de custom types para importarla alla y aca y decirle que reciba solo uno de esos datos en el body, y que no le puedas mandar cualquier cosa

async function findProductById(req: NextApiRequest, res: NextApiResponse) {
    const productId: any = req.query.id;
    if (!productId) {
        return res.status(422).send({ error: "Falta Id del producto en el query request ej. '/products/11'" });
    }
    const response: ProductResponse = await getProductById(productId);

    if (response instanceof Product) {
        res.status(200).send(response.productData);
    } else if (response.error) {
        res.status(500).send(response.error);
    } else {
        res.status(500).send({ error: "Error desconocido al obtener el producto." });
    }
}

const handler = method({
    get: findProductById,
});

export default handler;
