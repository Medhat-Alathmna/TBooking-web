import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { ResponseBody } from 'src/app/modals/response';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private api: ApiService) { }
  getStatistics(): Observable<ResponseBody<any>> {
    return this.api.get<ResponseBody<any>>(`home/statistics`)
  }

  refreshCache(): Observable<ResponseBody<any>> {
    return this.api.get<ResponseBody<any>>(`home/refreshcache`)
  }
}
