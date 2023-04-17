import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { getUserOrdersByUserId } from "controllers/orders";

async function getMyOrdersByMyUserId(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    const { userId } = decodedToken;
    const ordersDataArray = await getUserOrdersByUserId(userId);
    res.send(ordersDataArray);
}

const handler = method({
    get: getMyOrdersByMyUserId,
});

export default authMiddleware(handler);
