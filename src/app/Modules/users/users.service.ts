import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { UserInfo } from 'src/app/modals/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userAuth =JSON.parse(localStorage.getItem('userAuth'))?.user

  constructor(private api: ApiService) { }

  createUser(user: UserInfo,selectRold): Observable<UserInfo> {
    let body = {
      username: user.username,
      password: user.password,
      phone: user.phone,
      role: {
        connect: [{ id: selectRold.id }]
      },
      email: user.email
    }
    return this.api.post<UserInfo>(`users`, body);
  }

  updateUser(user,selectRold): Observable<UserInfo>{
    let body={
        email:user?.email,
        username:user?.username, 
        password:user?.password, 
        phone: user?.phone,
        role: selectRold.id 
      
    }
    return this.api.put<UserInfo>(`/users/${user.id}`,body);

  }
  getRoles(): Observable<any[]> {
    return this.api.get<any[]>(`users-permissions/roles`);
  }
  hideUser(user:any): Observable<any> {
    let body={
        hide:true,
        blocked:true,
        deletedBy:this.userAuth.username
      
    }
    return this.api.put<any>(`/users/${user.id}`,body);
    }
  userStatus(user:UserInfo): Observable<UserInfo> {
    let body={
        blocked:user.blocked,
      
    }
    return this.api.put<UserInfo>(`/users/${user.id}`,body);
    }


}
