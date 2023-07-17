import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserToken } from '../modals/UserToken';
import { AuthService } from '../Modules/auth/auth.service';
import { ConfigEnvironmentService } from './config.service';
export interface HttpOptions {
  post<T>(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl
  private bearerToken;
  
  constructor(private httpClient: HttpClient,private configEnvironment: ConfigEnvironmentService,private authService ?:AuthService) {
    let url = environment.apiUrl;
    if (url.charAt(url.length - 1) === '/') {
      url = url.slice(0, url.length - 1);
    }
    this.apiUrl = url;

    this.bearerToken = this.authService?.getAuthData()?.token_data



  }


  post<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.post<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  patch<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.patch<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.put<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  get<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.get<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders()
    })
  }
  getGuest<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.get<T>(`${this.apiUrl}${url}`)
  }
  getFile<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.get<T>(`${this.apiUrl}${url}`, {
      responseType:'blob' as 'json',
      headers: this.getHeaders()
    })
  }

  delete<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders()
    })
  }
  deletebody<T>(url: string,body): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;

    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders(),
      body:body
    })
  }

  postGuest<T>(url: string, body: any | null): Observable<T> {
    const headers = new HttpHeaders({
      'Accept-Language':localStorage.getItem('currentLang'),
    });
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.post<T>(`${this.apiUrl}${url}`, body,{
      headers
    });
  }
  deleteBody<T>(url: string, body: any | null, options?: HttpOptions): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, { body ,
      headers: this.getHeaders()});
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.bearerToken}`,
      'Accept-Language':localStorage.getItem('currentLang'),
    });

    return headers
  }



}


