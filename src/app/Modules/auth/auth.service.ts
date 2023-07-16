import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { ResponseBody } from 'src/app/modals/response';
import { UserToken } from 'src/app/modals/UserToken';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {

  }
  authData = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('authData')));
  authDataEmitter: Observable<UserToken> = this.authData.asObservable();

  public login(username: string, password: string): Observable<UserToken> {

    return this.httpClient.post<UserToken>(`${environment.apiUrl}api/login`,{
      username: username,
      password: password
    });
  }
  getAuthData() {

    return this.authData.value
  }
  clearAuthData() {
    localStorage.removeItem('authData')
    this.authData.next(null)
  }
}
