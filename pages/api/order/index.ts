import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { createOrder } from "controllers/orders";
import * as yup from "yup";

let querySchema = yup.object().shape({
    productId: yup.string().required(),
});

let bodySchema = yup
    .object()
    .shape({
        color: yup.string(),
        address: yup.string(),
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
        const { url } = await createOrder(decodedToken.userId, productId, req.body);
        res.send({ url });
    } catch (e) {
        res.status(400).send({ message: e });
    }
}

const postHandlerWithValidation = schemaMiddleware(bodySchema, postHandler); //tengo que crear la funcion schemaMiddleware para validar si tira error el body y la query, antes de que llegue al endpoint en cuestion

const handler = method({
    post: postHandlerWithValidation,
});

export default authMiddleware(handler);
