import { Order } from "models/order";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { getProductById } from "./products";
import { Product } from "models/product";
import type { productData, createOrderRes } from "lib/customTypes";
import { getUserById } from "./users";
import { sendEmail } from "lib/sendInBlue";

export async function createOrder(userId: string, productId: string, additionalInfo, quantity: number): Promise<createOrderRes> {
    const product: any = await getProductById(productId);
    if (!productId) {
        throw "productId is missing.";
    }
    if (!(product instanceof Product) && !product.error) {
        throw "product doesn't exist or productId is wrong.";
    }
    if (!(product instanceof Product) && product.error) {
        throw product.error;
    }
    const productData: productData = product.productData;

    const order: any = await Order.createNewOrder({
        additional_info: additionalInfo,
        productId,
        buyerId: userId,
        status: "pending",
    });

    //cambiar la notification_url por el link de produccion (creo que es "https://desafio-ecommerce-dwf-m9.vercel.app/api/webhooks/mercadopago") y usa la de AMERICAN EXPRESS de prueba
    const pref = await createPreference({
        external_reference: order.id,
        notification_url: "https://webhook.site/82e09a84-1d8a-4675-aad1-3df6cd17ff69",
        items: [
            {
                title: productData.title,
                description: productData.description,
                picture_url: productData.image_url,
                category_id: productData.category[0],
                quantity: quantity,
                currency_id: "ARS",
                unit_price: productData.price,
            },
        ],
        back_urls: {
            success: "https://apx.school",
        },
    });

    return { url: pref.init_point };
}

async function sendEmailBuyConfirmationToBuyer(buyerEmail: string, title: string, price: string) {
    const emailData = {
        subject: "Your activation code from Ecommerce",
        sender: { email: "l.calvetti.dev@gmail.com", name: "Ecommerce" },
        to: [{ buyerEmail }],
        htmlContent: "<html><body><h1>¡Felicidades! has comprado el siguiente producto: {{params.title}} al siguiente precio: ${{params.price}}</h1></body></html>",
        params: { title, price },
    };
    return sendEmail.sendTransacEmail(emailData);
}
async function sendEmailSaleConfirmationToVendor(vendorEmail: string, title: string, price: string) {
    const emailData = {
        subject: "Your activation code from Ecommerce",
        sender: { email: "l.calvetti.dev@gmail.com", name: "Ecommerce" },
        to: [{ vendorEmail }],
        htmlContent: "<html><body><h1>¡Felicidades! has vendido el siguiente producto: {{params.title}} y se te han acreditado a tu cuenta: ${{params.price}}</h1></body></html>",
        params: { title, price },
    };
    return sendEmail.sendTransacEmail(emailData);
}

export async function updateOrderStatus(mercadolibreOrderId: string) {
    const mercadolibreOrder = await getMerchantOrder(mercadolibreOrderId);
    const orderId = mercadolibreOrder.external_reference;
    const order = new Order(orderId);
    await order.pull();

    if (mercadolibreOrder.order_status == "paid") {
        order.data["status"] = "closed";
        order.data["external_order"] = mercadolibreOrder; //guardo la data que me mando mercadolibre por las dudas
        await order.push();
        const product = await getProductById(order.data.productId);
        if (product instanceof Product) {
            const vendor = await getUserById(product.productData.vendorId);
            const buyer = await getUserById(order.data.buyerId);
            await sendEmailBuyConfirmationToBuyer(buyer.email, product.productData.title, product.productData.price.toString());
            await sendEmailSaleConfirmationToVendor(vendor.email, product.productData.title, product.productData.price.toString());
        }
        return true;
    }
    if (mercadolibreOrder.order_status === "payment_required") {
        order.data.status = "pending";
        await order.push();
    }
    if (mercadolibreOrder.order_status === "payment_in_process") {
        order.data.status = "payment_in_process";
        await order.push();
    }
}

export async function getUserOrdersByUserId(userId: string) {
    const orders = await Order.searchForUserOrders(userId);
    return orders;
}

// PD ayudita: https://github.com/dylanpilsner/ecommerce-backend/blob/main/controllers/order.ts

// te queda ver si el webhook funciona bien y le manda el mail al vendedor y al comprador cuando creas una orden, para esto vas a tener que primero comitear todo a github y updatear el servidor con vercel (tambien las variables de entorno y demases)

//podes seguir por aca tmb:
// GET /me/orders     Devuelve todas mis ordenes con sus status.

//ya lo hice lo de GET /me/orders arriba pero para testearlo tengo que hacer lo de github y vercel que dije mas arriba,
//tambien tendria que dejar mejor el "me/orders" y el model orders en la parte de buscar mis ordenes y el controller porque como no lo pudiste testear te cuesta saber qué le falta que devuelve etc, deberias crear unas cuantas compras para saber que onda si las devuelve o no.
