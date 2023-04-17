import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserById, patchUserData } from "controllers/users";
import method from "micro-method-router";
import * as yup from "yup";
import { userData } from "lib/customTypes";

async function getUserData(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    const user: userData = await getUserById(decodedToken.userId);
    res.send(user);
}

const updateUserBodySchema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().strict(),
    address: yup.string().strict(),
});

async function updateUserData(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    try {
        await updateUserBodySchema.validate({
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
        });
        const { email, address, name } = req.body;
        const userData: userData = { email, address, name };
        const response = await patchUserData(decodedToken.userId, userData);
        if (!response.error) {
            res.status(200).send("Datos actualizados con éxito.");
        } else {
            res.status(500).send(response.error);
        }
    } catch (e) {
        res.status(422).send({ error: e.errors });
    }
}

const handler = method({
    get: getUserData,
    patch: updateUserData,
});

export default authMiddleware(handler);
