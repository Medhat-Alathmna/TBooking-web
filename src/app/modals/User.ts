import { isSet } from "../core/base/base.component"

export class UserInfo {
  id:string
  address?: string
  phone: string
  ext: string
  user_name: string
  email: string
  title: string
  password: string
  confirmPassword: string
  role: string

  public constructor(params?: UserInfo) {
    Object.assign(this, params);
}

public static cloneObject(objectToClone: UserInfo) {
    if (!isSet(objectToClone)) {
        return objectToClone;
    }
    const obj = new UserInfo(objectToClone);
    return obj;
}
public static cloneManyObjects(objectsToClone: UserInfo[]) {
    const objects: UserInfo[] = [];
    for (const obj of objectsToClone) {
        objects.push(UserInfo.cloneObject(obj));
    }

    return objects;
}

}
