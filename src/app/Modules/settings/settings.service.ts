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
  deleteNotifications(notfi: Notifications): Observable<Notifications[]> {
    return this.api.delete<Notifications[]>(`notifications/${notfi.id}`);
  }
  deletenumber(number: any): Observable<Notifications[]> {
    return this.api.delete<Notifications[]>(`forbidden-numbers/${number}`);
  }


  checkForbidNumbers(number): Observable<any[]> {
    return this.api.get<any[]>(`forbidden-numbers?filters[number][$contains]=${number}`);
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
