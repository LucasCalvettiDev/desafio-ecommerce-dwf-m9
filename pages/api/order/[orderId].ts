import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getOrderByOrderId } from "controllers/orders";
import method from "micro-method-router";

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
    const orderId: any = req.query.orderId;
    const response = await getOrderByOrderId(orderId);
    if (response) {
        res.send(response);
    } else {
        res.status(404).send({ error: "invalid orderId or it doesn't exist" });
    }
}

const handler = method({
    get: getHandler,
});

export default authMiddleware(handler);
