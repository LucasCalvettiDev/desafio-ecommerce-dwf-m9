import { Order } from "models/order";
import { createPreference } from "lib/mercadopago";

type createOrderRes = {
    url: string;
};

const products = {
    1234: {
        title: "Mate de Messi",
        price: 100,
    },
};

export async function createOrder(userId: string, productId: string, additionalInfo): Promise<createOrderRes> {
    const product = products[productId]; //aca lo estaria yendo a buscar a la DB en realidad
    if (!productId) {
        throw "productId is missing.";
    }
    if (!products[productId]) {
        throw "product doesn't exist or productId is wrong.";
    }

    const order = await Order.createNewOrder({
        additional_info: additionalInfo,
        productId,
        userId: userId,
        status: "pending",
    });

    const pref = await createPreference({
        external_reference: order.id,
        notification_url: "https://dwf-m9-payments-orcin.vercel.app/api/webhooks/mercadopago",
        items: [
            {
                title: product.title,
                description: "Dummy description",
                picture_url: "http://www.myapp.com/myimage.jpg",
                category_id: "car_electronics",
                quantity: 1,
                currency_id: "ARS",
                unit_price: product.price,
            },
        ],
        back_urls: {
            success: "https://apx.school",
        },
    });

    return { url: pref.init_point };
}
