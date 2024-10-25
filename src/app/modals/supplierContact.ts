import { isSet } from "../core/base/base.component"

export class SupplierContact {
    name?:string
    phone?:string
    email?:string
    note?:string
    address?:string

  public constructor(params?: SupplierContact) {
    Object.assign(this, params);
}

public static cloneObject(objectToClone: SupplierContact) {
    if (!isSet(objectToClone)) {
        return objectToClone;
    }
    const obj = new SupplierContact(objectToClone);
    return obj;
}
public static cloneManyObjects(objectsToClone: SupplierContact[]) {
    const objects: SupplierContact[] = [];
    for (const obj of objectsToClone) {
        objects.push(SupplierContact.cloneObject(obj));
    }

    return objects;
}

}
