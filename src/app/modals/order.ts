import { isSet } from "../core/base/base.component";

export class Order {
    id: any;
    attributes:any
    discount:number;
    cash:number;
    status:any;
    pay_by:any;
    notes:any;
    discountType:any;
    data:any;
    appointment:any;


    public constructor(params?: Order) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Order) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Order(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Order[]) {
        const objects: Order[] = [];
        for (const obj of objectsToClone) {
            objects.push(Order.cloneObject(obj));
        }

        return objects;
    }

}
