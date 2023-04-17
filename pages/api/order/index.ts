import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { createOrder } from "controllers/orders";
import * as yup from "yup";
import type { productData } from "lib/customTypes";

let querySchema = yup.object().shape({
    productId: yup.string().required(),
});

let bodySchema = yup
    .object()
    .shape({
        quantity: yup.number(),
        additionalInfo: yup.object(),
    })
    .noUnknown(true);

export async function postHandler(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    //chequeo req.query y req.body
    try {
        querySchema.validate(req.query);
    } catch (e) {
        res.status(422).send({ field: "query", message: e });
    }
    try {
        bodySchema.validate(req.body);
    } catch (e) {
        res.status(422).send({ field: "body", message: e });
    }
    const { productId } = req.query as any;
    try {
        const { additionalInfo, quantity } = req.body;
        const { url } = await createOrder(decodedToken.userId, productId, additionalInfo, quantity);
        res.send({ url });
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const handler = method({
    post: postHandler,
});

export default authMiddleware(handler);
