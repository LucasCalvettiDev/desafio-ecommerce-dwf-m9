import auth from "pages/api/auth";
import { firestore } from "../lib/firestore";
const collection = firestore.collection("auth");
import isAfter from "date-fns/isAfter";

export class Auth {
    ref: FirebaseFirestore.DocumentReference;
    data: any;
    id: string;
    constructor(id) {
        this.id = id;
        this.ref = collection.doc(id);
    }
    async pull() {
        const snap = await this.ref.get();
        this.data = snap.data();
    }
    async push() {
        this.ref.update(this.data);
    }
    isCodeExpired() {
        const now = new Date();
        const expires = this.data.expires.toDate();
        return isAfter(now, expires);
    }
    static async findByEmail(email: string) {
        const cleanEmail = Auth.cleanEmail(email);
        const results = await collection.where("email", "==", cleanEmail).get();
        if (results.docs.length) {
            const first = results.docs[0];
            const newAuth = new Auth(first.id);
            newAuth.data = first.data();
            return newAuth;
        } else {
            return null;
        }
    }
    static async createNewAuth(data) {
        const newAuthRef = await collection.add(data); //esto devuelve una referencia de la base de datos de auth
        const newAuth = new Auth(newAuthRef.id); //aca creamos la clase auth con el Id que creamos en la base de datos
        newAuth.data = data; //le seteamos la data a la clase
        //todo esto lo hacemos porque es mejor (mas seguro y ordenado) trabajar con la clase que directamente con la collection de firebase
        return newAuth;
    }
    static cleanEmail(email: string) {
        return email.trim().toLowerCase();
    }
    static async findByEmailAndCode(email: string, code: number) {
        const cleanEmail = Auth.cleanEmail(email);
        const result = await collection.where("email", "==", cleanEmail).where("code", "==", code).get();
        if (result.empty) {
            console.error("email y code no coinciden");
            return null;
        }
        const snapDoc = result.docs[0];
        const auth = new Auth(snapDoc.id);
        auth.data = snapDoc.data();
        return auth;
    }
}

//ref es la referencia a la base de datos de firebase
