import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';
import { Order } from 'src/app/modals/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  userAuth = JSON.parse(localStorage.getItem('userAuth'))?.user
  
  constructor(private api: ApiService) { }
  addOrder(order, orderNO, totalPrice, id): Observable<Appointment> {
    let body = {
      data: {
        appointment: id,
        orderNo: orderNO,
        services: order.services,
        products: order.products,
        status: order.status,
        discountType: order.discountType,
        orderBy: this.userAuth,
        discount: order.discount,
        employee: order.employee,
        cash: order.cash,
        pay_by: order?.payBy?.id,
        totalPrice: totalPrice,
      }
    }
    return this.api.post<Appointment>('/orders', body);
  }
  updateOrder(order: Order): Observable<Order> {
    let body = {
      data: {
        status: order.status,
        discount: order.discount,
        discountType: order.discountType,
        cash: order.cash,
        notes: order.notes,
        pay_by: order?.pay_by?.id,
      }
    }
    return this.api.put<Order>(`/orders/${order.id}`, body);
  }
  cancelOrder(order: Order): Observable<Order> {
    let body = {
      data: {
        status: 'Canceled',
      }
    }
    return this.api.put<Order>(`/orders/${order.id}`, body);
  }
  getOrder(id): Observable<any> {
    return this.api.get<Order>(`/orders/${id}?populate=*`);

  }

  draftAppointment(appointment: any): Observable<any> {
    let body = {
      data: {
        status: 'Draft'
      }
    }
    return this.api.put<any>(`/appointments/${appointment.id}`, body);
  }
  search(val): Observable<any> {
    return this.api.get<any>(`/searchOR?search=${val}`);
  }
  siteInfo(): Observable<any> {
    return this.api.get<any>(`/site-info`);
  }

}
