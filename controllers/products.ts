import { Product } from "models/product";
import { Products } from "models/products";
import { ProductResponse } from "lib/customTypes";
import { NextApiRequest } from "next";
import { getOffsetAndLimitFromReq } from "controllers/requests";

export async function getProductById(id: string): Promise<ProductResponse> {
    try {
        const product = new Product(id);
        await product.pull();
        return product;
    } catch (e) {
        return { error: e };
    }
}
export async function searchProductsPaginated(req: NextApiRequest) {
    const { offset, limit } = getOffsetAndLimitFromReq(req);
    const products = await Products.searchForProducts(req, limit, offset);
    return { products, limit, offset };
}
