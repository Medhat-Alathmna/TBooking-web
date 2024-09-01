import { isSet } from "../core/base/base.component"

export class Gallary {
    id?: string
    textEN: string
    textAR: string
    URL: string
    ads:any
    attributes:any
    published:boolean

    public constructor(params?: Gallary) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Gallary) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Gallary(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Gallary[]) {
        const objects: Gallary[] = [];
        for (const obj of objectsToClone) {
            objects.push(Gallary.cloneObject(obj));
        }

        return objects;
    }

}