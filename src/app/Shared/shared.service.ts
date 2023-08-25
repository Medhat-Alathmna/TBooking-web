import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private api: ApiService) { }

  getpayBy(): Observable<any[]> {
    return this.api.get<any[]>(`pay-bies?sort[0]=createdAt:desc&pagination[pageSize]=1000&filters[hide][$eq]=false`);
  }
  createPayBy(name): Observable<any> {
    let body = { data: {name } }
    return this.api.post<any>(`pay-bies`, body);
  }
  updatePayBy(name,id,type?): Observable<any>{
    let body = { data: {name } }
    let delet ={data:{hide:true}}
    return this.api.put<any>(`pay-bies/${id}`,type=='update'?body:delet);
  }
}
