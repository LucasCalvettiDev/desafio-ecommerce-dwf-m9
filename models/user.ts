import { firestore } from "../lib/firestore";
import type { userData } from "../lib/customTypes";
const collection = firestore.collection("users");

export class User {
    ref: FirebaseFirestore.DocumentReference;
    data: userData;
    id: string;
    constructor(id) {
        this.id = id;
        this.ref = collection.doc(id);
    }
    async pull() {
        try {
            const snap: any = await this.ref.get();
            this.data = snap.data();
        } catch (e) {
            return { error: e };
        }
    }
    async push() {
        try {
            this.ref.update(this.data);
        } catch (e) {
            return { error: e };
        }
    }
    static async createNewUser(data: userData) {
        const newUserRef = await collection.add(data); //esto devuelve una referencia de la base de datos de usuarios
        const newUser = new User(newUserRef.id); //aca creamos la clase user con el Id que creamos en la base de datos
        newUser.data = data; //le seteamos la data a la clase
        //todo esto lo hacemos porque es mejor (mas seguro y ordenado) trabajar con la clase que directamente con la collection de firebase
        return newUser;
    }
}
