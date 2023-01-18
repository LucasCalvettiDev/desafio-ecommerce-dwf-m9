import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);
    if (!auth) {
        res.status(401).send({
            message: "email or code incorrect",
        });
    }
    const expires = auth.isCodeExpired();
    if (expires) {
        res.status(401).send({
            message: "code expirado",
        });
    }

    const token = generate({ userId: auth.data.userId });
    res.send({ token });
}
//sendgrid no manda el mail porque es una poronga, fijate de cambiar la logica a otro sistema de mails, si no se resuelve proba https://www.sendinblue.com/
