import { generate, decode } from "./jwt";
import test from "ava";

test("jwt encode/decode", (t) => {
    const payload = { lucas: true };
    const token = generate(payload);
    const salida: any = decode(token);
    delete salida.iat;

    t.deepEqual(payload, salida);
});
