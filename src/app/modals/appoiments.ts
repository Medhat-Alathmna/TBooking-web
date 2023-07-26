import { isSet } from "../core/base/base.component";

export class Appointment {
    id: string;
    firstName:string;
    middleName:string;
    lastName:string;
    phone?: string;
    address?: string;
    notes?: string;
    deposit?: number;
    appoBy?: any;
    services?: any;
    employee?: any;
    approved?: boolean;
    hide?: boolean;
    fromDate?: Date |any;
    createdAt?: Date |any;
    toDate?: Date |any;
    number?: any;
    customer:{
        firstName:string;
    middleName:string;
    lastName:string;
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
