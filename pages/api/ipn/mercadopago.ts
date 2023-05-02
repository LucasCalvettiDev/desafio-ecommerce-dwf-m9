import { NextApiRequest, NextApiResponse } from "next";
import { updateOrderStatus } from "controllers/orders";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
        await updateOrderStatus(id as string);
    }
    res.send("Mercadopago webhook has been called.");
}
