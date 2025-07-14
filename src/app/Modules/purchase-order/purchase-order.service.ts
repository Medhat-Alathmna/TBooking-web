import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { PurchaseOrder } from 'src/app/modals/po';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  userAuth = JSON.parse(localStorage.getItem('userAuth'))

  constructor(private api: ApiService) { }

  createPO(po: PurchaseOrder): Observable<any> {
    let body = {
      vendor: po.vendor,
      cash: po.cash,
      status: po.status,
      pic:po.pic,
      payments: po.payments,
      products: po.products,
      addedToStuck: po.addedToStuck,
      createBy: this.userAuth.user,
    }
    console.log(body);
    
    return this.api.post<any>(`po`, body);
  }
  updatePO(po: PurchaseOrder, id): Observable<any> {
    let body = {
      data: {
        vendor: po.vendor,
        cash: po.cash,
        status: po.status,
        payments: po.payments,
        products: po.products,
        pic:po.pic,
        addedToStuck: po.addedToStuck,
        createBy: this.userAuth.user,
      }

    }
    return this.api.put<any>(`/purchase-orders/${id}`, body);
  }
  getPO(id): Observable<any> {
    return this.api.get<any>(`/purchase-orders/${id}?populate=*`);

  }

  updateStock(products) {
    let body = {
      products
    }
    return this.api.post<any>(`addStuck`, body);
  }
  uploadMedia(img: any): Observable<any> {
    return this.api.post<any>(`upload`, img);
  }
}
