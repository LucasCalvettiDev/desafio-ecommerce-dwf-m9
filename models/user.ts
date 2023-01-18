import { firestore } from "../lib/firestore";

const collection = firestore.collection("users");

export class User {
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
    static async createNewUser(data) {
        const newUserRef = await collection.add(data); //esto devuelve una referencia de la base de datos de usuarios
        const newUser = new User(newUserRef.id); //aca creamos la clase user con el Id que creamos en la base de datos
        newUser.data = data; //le seteamos la data a la clase
        //todo esto lo hacemos porque es mejor (mas seguro y ordenado) trabajar con la clase que directamente con la collection de firebase
        return newUser;
    }
}
