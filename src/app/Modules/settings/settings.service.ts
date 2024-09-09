import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Notifications } from 'src/app/modals/notfi';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private api: ApiService) { }


  getNotifications(): Observable<any[]> {
    return this.api.get<any[]>(`notifications`);
  }
  getGeneralSettings(): Observable<any> {
    return this.api.get<any>(`/general-setting`); 
   }
  getCurrencies(): Observable<any> {
    return this.api.get<any>(`/currency`); 
   }
  createNotifications(notfi: Notifications): Observable<Notifications[]> {
    let body = {
      data: {
        title: notfi.title,
        body: notfi.body,
        type: notfi.type,
        main: false
      }
    }
    return this.api.post<Notifications[]>(`notifications`, body);
  }
  updateNotifications(notfi: Notifications): Observable<Notifications[]> {
    let body = {
      data: {
        title: notfi.title,
        body: notfi.body,
        type: notfi.type,
        main: false
      }
    }
    return this.api.put<Notifications[]>(`notifications/${notfi.id}`, body);
  }
  updateGeneralSettings(color: any): Observable<any> {
    let body = {
      data: {
        textColor:color.textColor,
        primaryColor:color.primaryColor,
        secondaryColor:color.secondaryColor,
       
      }
    }
    return this.api.put<any>(`general-setting`, body);
  }
  updateCurrency(code: any): Observable<any> {
    let body = {data: {code}}
    return this.api.put<any>(`currency`, body);
  }
  deleteNotifications(notfi: Notifications): Observable<Notifications[]> {
    return this.api.delete<Notifications[]>(`notifications/${notfi.id}`);
  }
  deletenumber(number: any): Observable<Notifications[]> {
    return this.api.delete<Notifications[]>(`forbidden-numbers/${number}`);
  }


  checkForbidNumbers(number): Observable<any[]> {
    return this.api.get<any[]>(`forbidden-numbers?filters[number][$contains]=${number}`);
  }

  getPhoneGroup(): Observable<any[]> {
    return this.api.get<any[]>(`numbers`);
  }
  createForbidNumbers(forbid: any): Observable<any> {
    let body = {
      data: {
        name: forbid.name,
        number: forbid.number,
      }
    }
    return this.api.post<any>(`forbidden-numbers`, body);
  }
}
