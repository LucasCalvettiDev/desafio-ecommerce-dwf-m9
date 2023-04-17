import { productsIndex } from "../lib/algolia";
import type { SearchIndex } from "algoliasearch";
import type { productData } from "lib/customTypes";

export class Product {
    ref: SearchIndex;
    productData: productData;
    id: string;
    constructor(id) {
        this.id = id;
        this.ref = productsIndex;
    }
    async pull() {
        try {
            const productData: productData = await this.ref.getObject(this.id);
            this.productData = productData;
        } catch (e) {
            return { error: e };
        }
    }
}
