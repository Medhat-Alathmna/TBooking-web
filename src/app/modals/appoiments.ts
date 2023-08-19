import { isSet } from "../core/base/base.component";

export class Appointment {
    id: any;
    firstName:any;
    middleName:any;
    lastName:any;
    phone?: any;
    address?: any;
    notes?: any;
    deposit?: number;
    appoBy?: any;
    services?: any;
    status?: any;
    employee?: any;
    approved?: boolean;
    hide?: boolean;
    fromDate?: Date |any;
    createdAt?: Date |any;
    toDate?: Date |any;
    number?: any;
    products?: any;
    customer:{
        firstName:any;
    middleName:any;
    lastName:any;
    }

    public constructor(params?: Appointment) {
        Object.assign(this, params);
    }

    public static cloneObject(objectToClone: Appointment) {
        if (!isSet(objectToClone)) {
            return objectToClone;
        }
        const obj = new Appointment(objectToClone);
        return obj;
    }
    public static cloneManyObjects(objectsToClone: Appointment[]) {
        const objects: Appointment[] = [];
        for (const obj of objectsToClone) {
            objects.push(Appointment.cloneObject(obj));
        }

        return objects;
    }

}
