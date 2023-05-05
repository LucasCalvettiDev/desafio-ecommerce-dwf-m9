import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { patchOneUserData } from "controllers/users";
import method from "micro-method-router";

async function updateOneUserData(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    const dataName: any = req.query.oneUserData;
    const dataToUpdate = req.body[dataName];
    if (!dataToUpdate) {
        return res.status(422).send({ error: "No hay dato que concuerde con el query, revisar que el nombre del dato a modificar sea igual al final de la ruta dinámica" });
    }
    const response = await patchOneUserData(decodedToken.userId, dataName, dataToUpdate);
    if (!response.error) {
        res.status(200).send(`Dato ${dataName} actualizado con éxito.`);
    } else {
        res.status(500).send(response.error);
    }
}

const handler = method({
    patch: updateOneUserData,
});

export default authMiddleware(handler);
