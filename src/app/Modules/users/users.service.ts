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
      username: user.username,
      password: user.password ,
      phone: user.phone ,
      role: 'Authenticated' ,
      email: user.email 
      }
      console.log(body);
      
    return this.api.post<UserInfo>(`users`, body);
  }

  getUsers(): Observable<any[]>{
    return this.api.get<any[]>(`users`);

  }
}
