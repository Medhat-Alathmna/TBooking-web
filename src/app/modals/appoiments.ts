import { isSet } from "../core/base/base.component";

export class Appointment {
    id: string;
    Customer_Id: string;
    FK_user: any;
    First_Name?: string;
    Middle_Name?: string;
    Last_Name?: string;
    Phone?: string;
    Address?: string;
    Notes?: string;
    Deposit?: number;
    Employee?: number;
    FromTime?: Date |any;
    ToTime?: Date |any;

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
