import { Product } from "models/product";

export type productData = {
    objectID: string;
    title: string;
    color?: string[];
    description: string;
    price: number;
    image_url: string;
    category: string[];
    vendorId: string;
};

export type ProductResponse = Product | { error: string };

export type createOrderRes = {
    url: string;
};

export type orderData = {
    additional_info?: {};
    createdAt?: Date;
    productId: string;
    buyerId: string;
    status: "pending" | "closed" | "payment_in_process";
    external_order?: {};
};

export type userData = {
    email: string;
    name?: string;
    address?: string;
};
