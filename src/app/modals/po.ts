import { isSet } from "../core/base/base.component"
import { Products } from "./products"

export class PurchaseOrder {
  id:string
  no: any
  vendor: any
  cash:any
  status:any
  payments:any
  products:Products|any
  createdAt:any
  selectedVendor:any
  addedToStuck:boolean
  public constructor(params?: PurchaseOrder) {
    Object.assign(this, params);
}

public static cloneObject(objectToClone: PurchaseOrder) {
    if (!isSet(objectToClone)) {
        return objectToClone;
    }
    const obj = new PurchaseOrder(objectToClone);
    return obj;
}
public static cloneManyObjects(objectsToClone: PurchaseOrder[]) {
    const objects: PurchaseOrder[] = [];
    for (const obj of objectsToClone) {
        objects.push(PurchaseOrder.cloneObject(obj));
    }

    return objects;
}

}
