import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';
import { Products, StockAdjustmentPayload } from 'src/app/modals/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  public saveStockAdjustment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public saveStockAdjustmentEmitter: Observable<boolean> = this.saveStockAdjustment.asObservable();


  userAuth = JSON.parse(localStorage.getItem('userAuth'))?.user
  constructor(private api: ApiService) { }

  createProduct(product: Products): Observable<Products> {
   
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: 0,
        sellPrice: product?.sellPrice,
        brand: product?.brand,
        suppliers: product?.suppliers,
        details: product?.details,
        hide: false,
        category: [],

      }
    }
    return this.api.post<Products>(`products`, body);
  }
  getProduct(id): Observable<any> {
    return this.api.get<any>(`products/${id}`);
  }
  updateProduct(product: Products, id, type): Observable<any> {
    product.category.forEach(cat => {
      cat.subCategory = cat.subCategory.filter(item => item.id !== 0);
      if (cat.selectedItem.id === 0) {
        cat.selectedItem = null
      }
    });
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        sellPrice: product?.sellPrice,
        brand: product?.brand,
        suppliers: product?.suppliers,
        details: product?.details,
        category: product?.category,

      }
    }
    let delte = { data: { hide: true, deletedBy: this.userAuth.username } }
    return this.api.put<any>(`products/${id}`, type == 'update' ? body : delte);
  }
  getBrands(): Observable<any> {
    return this.api.get<any>(`brands?sort[0]=createdAt:desc&pagination[pageSize]=1000&filters[hide][$eq]=false`);
  }
  applayCatProducts(selectedCat): Observable<any> {
    return this.api.post<any>(`applayCatProducts`, selectedCat);
  }
  productInfo(id, from, to): Observable<any> {
    const date = isSet(from) ? `?startDate=${from.toISOString()}&endDate=${to.toISOString()}` : ''
    return this.api.get<any>(`productInfo/${id}${date}`);
  }
  createBrand(name): Observable<any> {
    let body = { data: { name } }
    return this.api.post<any>(`brands`, body);
  }
  updateBrand(name, id, type?): Observable<any> {
    let body = { data: { name } }
    let delet = { data: { hide: true } }
    return this.api.put<any>(`brands/${id}`, type == 'update' ? body : delet);
  }
  createAdjustment(payload: StockAdjustmentPayload): Observable<StockAdjustmentPayload> {
    let body = {
        product: payload.product,
        quantity: payload.quantity ?? '0',
        reason: payload.reason,
        note: payload.note || undefined,
        cost: payload.cost ?? '0',
        stocks: payload.stocks ?? '0',
        user: this.userAuth
    }
    return this.api.post<StockAdjustmentPayload>(`stock-adjustments`, body);
  }
  productLogs(productId): Observable<any> {
    return this.api.get<any>(`productLogs/${productId}`);
  }

  
}
