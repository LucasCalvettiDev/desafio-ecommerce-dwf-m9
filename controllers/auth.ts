import { User } from "models/user";
import { Auth } from "models/auth";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { sendEmail } from "lib/sendInBlue";

var random = gen.create();

//Encuetra o crea un Auth, recibiendo un email de parametro
export async function findOrCreateAuth(email: string): Promise<Auth> {
    const cleanEmail = email.trim().toLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);
    if (auth) {
        return auth;
    } else {
        //si no hay auth, significa que no hay usuario con ese mail y lo crea primero
        const newUser = await User.createNewUser({
            email: cleanEmail,
        });
        const newAuth = await Auth.createNewAuth({
            email: cleanEmail,
            userId: newUser.id,
            code: "",
            expires: new Date(),
        });
        return newAuth;
    }
}

function sendValidationEmail(email: string, code: number) {
    const emailData = {
        subject: "Your activation code from Ecommerce",
        sender: { email: "l.calvetti.dev@gmail.com", name: "Ecommerce" },
        to: [{ email }],
        htmlContent: "<html><body><h1>Your activation code is: {{params.code}}</h1></body></html>",
        params: { code },
    };

    return sendEmail.sendTransacEmail(emailData);
}

//Envia Email con el Código de acceso y le agrega 20 minutos de expiración
export async function sendCode(email: string) {
    const auth = await findOrCreateAuth(email);
    const code = random.intBetween(10000, 99999);
    const now = new Date();
    const twentyMinutesFromNow = addMinutes(now, 20);
    auth.data.code = code;
    auth.data.expires = twentyMinutesFromNow;
    await auth.push();
    await sendValidationEmail(email, code);
    return true;
}
