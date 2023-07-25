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
    return this.api.get<any[]>('/services');
  }

  createService(service: Services): Observable<any> {
    let body = {
      data: {
        price: service.price,
        ar: service.ar,
        en: service.en
      }
    }
    return this.api.post<any>(`services`, body);
  }

  updateService(service: Services): Observable<any> {
    let body = {
      data: {
        price: service.price,
        ar: service.ar,
        en: service.en
      }
    }
    return this.api.put<any>(`services/${service.id}`, body);
  }
}
