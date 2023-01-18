import { NextApiRequest, NextApiResponse } from "next";
import { Auth } from "models/auth";
import { sendCode } from "controllers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body;
    if (email) {
        const result = await sendCode(email);
        res.send(result);
    } else {
        res.status(400).send({ message: "Email is missing." });
    }
}
