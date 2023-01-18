import { firestore } from "../lib/firestore";

const collection = firestore.collection("orders");

export class Order {
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
    static async createNewOrder(newOrderData = {}) {
        const newOrderRef = await collection.add(newOrderData); //esto devuelve una referencia de la base de datos de orders
        const newOrder = new Order(newOrderRef.id); //aca creamos la clase Order con el Id que creamos en la base de datos
        newOrder.data.createdAt = new Date();
        newOrder.data = newOrderData; //le seteamos la data a la clase
        //todo esto lo hacemos porque es mejor (mas seguro y ordenado) trabajar con la clase que directamente con la collection de firebase
        return newOrder;
    }
}
