import { isSet } from "../core/base/base.component";



export class Services {
    price?:number
    en?:any
    ar?:any
    id:string

    public constructor(params?: Services) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Services) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Services(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Services[]) {
        const objects: Services[] = [];
        for (const obj of objectsToClone) {
            objects.push(Services.cloneObject(obj));
        }

        return objects;
    }

}
