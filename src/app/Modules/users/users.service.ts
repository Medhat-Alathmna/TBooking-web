import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { UserInfo } from 'src/app/modals/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  createUser(user:UserInfo): Observable<UserInfo> {    
    let body = { 
      user_name: user.user_name,
      password: user.password ,
      phone: user.phone ,
      address: user?.address ,
      role: user.role ,
      email: user.email 
      }
    return this.api.post<UserInfo>(`Register`, body);
  }
}
