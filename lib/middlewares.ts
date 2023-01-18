import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "lib/jwt";
import parseToken from "parse-bearer-token";

export function authMiddleware(callback) {
    return function (req: NextApiRequest, res: NextApiResponse) {
        const token = parseToken(req);
        if (!token) {
            res.status(401).send({ message: "no hay token" });
        }
        const decodedToken = decode(token); //devuelve objeto con userId y iat (issue at, o sea genera a tal hora), para convertir en fecha
        if (decodedToken) {
            callback(req, res, decodedToken);
        } else {
            res.status(401).send({ message: "token incorrecto" });
        }
    };
}
