import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Services } from 'src/app/modals/service';

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
      Description_Ar: service.service_ar,
       Description_En: service.service_en ,
       Insert_By: 1 
      }
    return this.api.post<any>(`Services`, body);
  }
  createSubService(subService,surviceID,userID): Observable<any> {    
    let body = { 
      FK_Service_Id:surviceID,
      Description_Ar: subService.name_ar,
      Description_En:subService.name_en,
      Insert_By:userID    
      }
    return this.api.post<any>(`SubService`, body);
  }

  updateSubService(subService,surviceID,userID): Observable<any> {    
    let body = { 
      sub_service_id:subService.sub_service_id,
      FK_Service_Id:surviceID,
      Description_Ar: subService.name_ar,
      Description_En:subService.name_en,
      Insert_By:userID    
      }
    return this.api.put<any>(`SubService`, body);
  }
  updateService(service:Services,userID): Observable<any> {    
    let body = { 
      Service_Id:service.Service_Id,
      Description_Ar: service.service_ar,
       Description_En: service.service_en ,
       Update_By: userID 
      }
    return this.api.put<any>(`Services`, body);
  }
}
