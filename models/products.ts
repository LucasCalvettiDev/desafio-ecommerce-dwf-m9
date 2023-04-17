import { productsIndex } from "../lib/algolia";
import type { SearchIndex } from "algoliasearch";
import type { productData } from "lib/customTypes";
import type { NextApiRequest } from "next";

export class Products {
    ref: SearchIndex = productsIndex;
    productsData: productData[] = [];
    id: string;

    static async searchForProducts(req: NextApiRequest, limit: number, offset: number) {
        const { hits, nbHits } = await productsIndex.search(req.query.q as string, {
            hitsPerPage: limit,
            page: offset > 1 ? Math.floor(offset / limit) : 0,
        });

        return {
            numberOfProductsFound: nbHits as number,
            products: hits as productData[],
        };
    }
}
