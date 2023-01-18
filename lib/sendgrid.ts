import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendVerificationEmail(email: string, verificationCode: string) {
    const message = {
        to: email,
        from: "calvo_101@yahoo.com.ar",
        subject: "App verification Code test",
        text: "your verification code is: " + verificationCode,
        html: "<strong>prueba</strong>",
    };
    sgMail
        .send(message)
        .then(() => {
            console.log("verification email sent");
        })
        .catch((error) => {
            console.error(error);
        });
}
