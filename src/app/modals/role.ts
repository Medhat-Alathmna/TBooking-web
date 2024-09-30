import { isSet } from "../core/base/base.component"

export class RoleInfo {
    id: string
    role: string
    description: string
    attributes:any
  
    createdAt: any
    public constructor(params?: RoleInfo) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: RoleInfo) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new RoleInfo(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: RoleInfo[]) {
        const objects: RoleInfo[] = [];
        for (const obj of objectsToClone) {
            objects.push(RoleInfo.cloneObject(obj));
        }

        return objects;
    }

}