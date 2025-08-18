import { isSet } from "../core/base/base.component";

export class Products {
    id: any;
    name: string;
    barcode?: string;
    notes?: string;
    price?: number;
    stocks?: number;
    sellPrice?: number;
    qty?: number;
    brand?: any;
    suppliers?: any;
    details?: any;
    attributes?: any;
    category?: any[];
    selectCat?: any;


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
export class StockAdjustmentPayload {
product: number | string;
quantity: number=0
reason: 'Opening Balance' | 'Count Adjustment' | 'Vendor Gift' | 'Inhouse Production' | 'Other' | string='Opening Balance'
note?: string;
cost?: number=0
stocks?: number=0
action:'increase' | 'decrease'='increase'
}

export interface StockMovement {
id: number | string;
productId: number | string;
productName: string;
direction: 1 | -1;
quantity: number;
reason: string;
note?: string;
createdAt: string | Date;
}