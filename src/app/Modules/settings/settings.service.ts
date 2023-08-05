import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Notifications } from 'src/app/modals/notfi';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private api:ApiService) { }


  getNotifications(): Observable<any[]> {
    return this.api.get<any[]>(`notifications`);
  }
  createNotifications(notfi:Notifications): Observable<Notifications[]> {
    let body={
      data:{
        title:notfi.title,
        body:notfi.body,
        type:notfi.type,
        main:false
      }
    }
    return this.api.post<Notifications[]>(`notifications`,body);
  }
}
