//me.ts devuelve info del usuario del token
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserById } from "controllers/users";
import method from "micro-method-router";

async function postHandler(req: NextApiRequest, res: NextApiResponse, decodedToken) {
    const user = await getUserById(decodedToken.userId);
    res.send(user);
}

const handler = method({
    post: postHandler,
});

export default authMiddleware(handler);
