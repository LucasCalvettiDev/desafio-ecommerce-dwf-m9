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

    const pref = await createPreference({
        external_reference: order.id,
        notification_url: "https://desafio-ecommerce-dwf-m9-gyrk.vercel.app/api/webhooks/mercadopago",
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
        subject: "You have one new purchase at Ecommerce",
        sender: { email: "l.calvetti.dev@gmail.com", name: "Ecommerce" },
        to: [{ email: buyerEmail }],
        htmlContent: "<html><body><h1>¡Felicidades! has comprado el siguiente producto: {{params.title}} al siguiente precio: ${{params.price}}</h1></body></html>",
        params: { title, price },
    };
    return sendEmail.sendTransacEmail(emailData);
}
async function sendEmailSaleConfirmationToVendor(vendorEmail: string, title: string, price: string) {
    const emailData = {
        subject: "You have one new sale at Ecommerce",
        sender: { email: "l.calvetti.dev@gmail.com", name: "Ecommerce" },
        to: [{ email: vendorEmail }],
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
export async function getOrderByOrderId(orderId: string) {
    const order = new Order(orderId);
    await order.push();
    return order.data;
}
