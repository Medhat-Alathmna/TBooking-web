import { isSet } from "../core/base/base.component";

export class Products {
    id: any;
    name: string;
    barcode?: string;
    notes?: string;
    price: number;
    stocks?: number;
    buyPrice?: number;
    qty?: number;
    brand?: any;
    suppliers?: any;
    details?: any;
    attributes?: any;


    public constructor(params?: Products) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Products) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Products(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Products[]) {
        const objects: Products[] = [];
        for (const obj of objectsToClone) {
            objects.push(Products.cloneObject(obj));
        }

        return objects;
    }

}
