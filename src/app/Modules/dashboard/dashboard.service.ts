import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private api: ApiService) { }

  count(from,to): Observable<any> {
const date=   isSet(from)?`?startDate=${from.toISOString()}&endDate=${to.toISOString()}`:''
    return this.api.get<any>(`/count${date}`);
  }
}
