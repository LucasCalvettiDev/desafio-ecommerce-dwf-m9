import { firestore } from "../lib/firestore";
import { orderData } from "../lib/customTypes";
const collection = firestore.collection("orders");

export class Order {
    ref: FirebaseFirestore.DocumentReference;
    data: orderData;
    id: string;
    constructor(id) {
        this.id = id;
        this.ref = collection.doc(id);
    }
    async pull() {
        const snap: any = await this.ref.get();
        this.data = snap.data();
    }
    async push() {
        this.ref.update(this.data);
    }
    static async createNewOrder(newOrderData: orderData) {
        try {
            const newOrderRef = await collection.add(newOrderData);
            const newOrder = new Order(newOrderRef.id);

            newOrder.data = newOrderData;
            newOrder.data.createdAt = new Date();
            return newOrder;
        } catch (e) {
            return { error: e };
        }
    }
    static async searchForUserOrders(userId: string) {
        try {
            const myOrdersSnap = await collection.where("buyerId", "==", userId).get();
            if (myOrdersSnap.docs) {
                return myOrdersSnap.docs;
            }
        } catch (e) {
            return { error: e };
        }
    }
}
