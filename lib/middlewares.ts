import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "lib/jwt";
import parseToken from "parse-bearer-token";
import * as yup from "yup";

const headerSchema = yup.object().shape({
    authorization: yup
        .string()
        .required()
        .matches(/^Bearer\s+[a-zA-Z0-9-_.]+$/i),
});

export function authMiddleware(callback) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        try {
            await headerSchema.validate({
                authorization: req.headers.authorization,
            });
            const token = parseToken(req);
            const decodedToken = decode(token); //devuelve objeto con userId y iat (issue at, o sea genera a tal hora), para convertir en fecha
            if (decodedToken) {
                callback(req, res, decodedToken);
            } else {
                res.status(401).send({ message: "token incorrecto" });
            }
        } catch (e) {
            res.status(401).send({ message: e.errors });
        }
    };
}
