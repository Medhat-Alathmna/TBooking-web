import { isSet } from "../core/base/base.component";



export class SubServices {
    sub_service_id: string;
    name_ar: any;
    name_en: string;
    Insert_By: string;

    public constructor(params?: SubServices) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: SubServices) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new SubServices(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: SubServices[]) {
        const objects: SubServices[] = [];
        for (const obj of objectsToClone) {
            objects.push(SubServices.cloneObject(obj));
        }

        return objects;
    }

}
