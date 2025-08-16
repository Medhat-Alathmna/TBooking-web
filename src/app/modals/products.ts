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
export interface StockAdjustmentPayload {
product: number | string;
direction: 1 | -1; // 1 increase, -1 decrease
quantity: number;
reason: 'opening_balance' | 'count_adjustment' | 'vendor_gift' | 'inhouse_production' | 'other' | string;
note?: string;
cost?: number;
action
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