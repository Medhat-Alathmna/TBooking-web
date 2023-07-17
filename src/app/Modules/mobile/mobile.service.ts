import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(private api: ApiService) { }

  getServices(): Observable<any[]> {
    return this.api.get<any[]>('/Services');
  }
  getSubServices(id): Observable<any[]> {
    return this.api.get<any[]>(`/SubService?FK_Service_Id=${id}`);
  }
  createService(service): Observable<any> {
    let body = { 
      Description_Ar: service.Description_Ar,
       Description_En: service.Description_En 
      }
    return this.api.post<any>(`Services`, body);
  }
}
