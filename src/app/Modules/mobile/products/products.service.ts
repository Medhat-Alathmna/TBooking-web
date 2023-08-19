import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Products } from 'src/app/modals/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private api: ApiService) { }

  createProduct(product: Products): Observable<any> {
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        buyPrice: product?.buyPrice,
        brand: product?.brand
      }
    }
    return this.api.post<any>(`products`, body);
  }
  updateProduct(product: Products,id): Observable<any> {
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        buyPrice: product?.buyPrice,
        brand: product?.brand
      }
    }
    return this.api.put<any>(`products/${id}`, body);
  }
 
}
