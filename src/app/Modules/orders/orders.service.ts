import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';
import { Order } from 'src/app/modals/order';

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
        products:order.products,
        status:'Draft',
        orderBy:this.userAuth.username,
        discount:0,
        cash:0,
        totalPrice:totalPrice,
      }      
    }
    console.log(body);
    
    return this.api.post<Appointment>('/orders',body);
  }
  updateOrder(order:Order): Observable<Order> {
    let body={
      data:{
        status:order.status,
        discount:order.discount,
        discountType:order.discountType,
        cash:order.cash,
        notes:order.notes,
      }
    }
    return this.api.put<Order>(`/orders/${order.id}`,body);
  }
  cancelOrder(order:Order): Observable<Order> {
    let body={
      data:{
        status:'Canceled',
      }
    }
    return this.api.put<Order>(`/orders/${order.id}`,body);
  }

  draftAppointment(appointment:any): Observable<any> {
    let body={
      data:{
        status:'Draft'
      }
    }
    return this.api.put<any>(`/appointments/${appointment.id}`,body); 
   }
}
