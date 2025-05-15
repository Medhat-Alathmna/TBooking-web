import { isSet } from "../core/base/base.component"

export class Vendor {
  id:string
  name: string
  address?:any
  phone?: string
  companyPhone?: string
  email?: string
  vendorType?: any
  isCompanyShow?:boolean
  company: any
  createdAt:any
  public constructor(params?: Vendor) {
    Object.assign(this, params);
}

public static cloneObject(objectToClone: Vendor) {
    if (!isSet(objectToClone)) {
        return objectToClone;
    }
    const obj = new Vendor(objectToClone);
    return obj;
}
public static cloneManyObjects(objectsToClone: Vendor[]) {
    const objects: Vendor[] = [];
    for (const obj of objectsToClone) {
        objects.push(Vendor.cloneObject(obj));
    }

    return objects;
}

}
