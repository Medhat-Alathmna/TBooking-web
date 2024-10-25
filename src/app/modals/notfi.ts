import { isSet } from "../core/base/base.component";



export class Notifications {
    title:string
    id:any
    body:string
    type:string
    main:boolean

    public constructor(params?: Notifications) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Notifications) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Notifications(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Notifications[]) {
        const objects: Notifications[] = [];
        for (const obj of objectsToClone) {
            objects.push(Notifications.cloneObject(obj));
        }

        return objects;
    }

}
