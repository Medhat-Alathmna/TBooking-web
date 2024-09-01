import { isSet } from "../core/base/base.component"

export class RoleInfo {
    id: string
    role: string
    description: string
    attributes:any
    pages: any = [
        { name: 'Calender', route: '/calender', isAllowed: false },
        { name: 'Convert to Order', route: '/calender', isAllowed: false },
        { name: 'Orders', route: '/orders', isAllowed: false },
        { name: 'Users', route: '/users', isAllowed: false },
        { name: 'Roles', route: '/roles', isAllowed: false },
        { name: 'Dashboard', route: '/dashboard', isAllowed: false },
        { name: 'Services', route: '/mobile', isAllowed: false },
        { name: 'Add Service', route: '/mobile', isAllowed: false },
        { name: 'Edit Service', route: '/mobile', isAllowed: false },
        { name: 'Delete Service', route: '/mobile', isAllowed: false },
        { name: 'Products', route: '/mobile', isAllowed: false },
        { name: 'Add Product', route: '/mobile', isAllowed: false },
        { name: 'Edit Product', route: '/mobile', isAllowed: false },
        { name: 'Delete Product', route: '/mobile', isAllowed: false },

]
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