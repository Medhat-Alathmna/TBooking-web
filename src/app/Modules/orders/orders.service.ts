import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  userAuth =JSON.parse(localStorage.getItem('userAuth'))?.user


  constructor(private api: ApiService) { }
  addOrder(order,orderNO,totalPrice,id): Observable<Appointment> {
    let body={
      data:{
        appointment:id,
        orderNo:orderNO,
        services:order.services,
        status:'Draft',
        orderBy:this.userAuth.username,
        totalPrice:totalPrice
      }      
    }
    console.log(body);
    
    return this.api.post<Appointment>('/orders',body);
  }
}
