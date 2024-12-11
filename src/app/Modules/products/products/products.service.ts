import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';
import { Products } from 'src/app/modals/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  userAuth = JSON.parse(localStorage.getItem('userAuth'))?.user
  constructor(private api: ApiService) { }

  createProduct(product: Products): Observable<any> {
    product.category.forEach(cat => {
      cat.subCategory = cat.subCategory.filter(item => item.id !== 0);
      if (cat.selectedItem.id===0) {
        cat.selectedItem=null
      }
    });
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        buyPrice: product?.buyPrice,
        brand: product?.brand,
        suppliers: product?.suppliers,
        details: product?.details,
        hide:false,
        category: product?.category,

      }
    }
    return this.api.post<any>(`products`, body);
  }
  getProduct(id): Observable<any> {
    return this.api.get<any>(`products/${id}`);
  }
  updateProduct(product: Products, id ,type): Observable<any> {
    product.category.forEach(cat => {
      cat.subCategory = cat.subCategory.filter(item => item.id !== 0);
      if (cat.selectedItem.id===0) {
        cat.selectedItem=null
      }
    });
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        buyPrice: product?.buyPrice,
        brand: product?.brand,
        suppliers: product?.suppliers,
        details: product?.details,
        category: product?.category,

      }
    }
    let delte ={data:{hide:true,deletedBy:this.userAuth.username}}
    return this.api.put<any>(`products/${id}`, type=='update'?body:delte);
  }
  getBrands(): Observable<any> {
    return this.api.get<any>(`brands?sort[0]=createdAt:desc&pagination[pageSize]=1000&filters[hide][$eq]=false`);
  }
  applayCatProducts(selectedCat): Observable<any> {
    return this.api.post<any>(`applayCatProducts`,selectedCat);
  }
  productInfo(id,from, to): Observable<any> {
    const date = isSet(from) ? `?startDate=${from.toISOString()}&endDate=${to.toISOString()}` : ''
    return this.api.get<any>(`productInfo/${id}${date}`);
  }
  createBrand(name): Observable<any> {
    let body = { data: {name } }
    return this.api.post<any>(`brands`, body);
  }
  updateBrand(name,id,type?): Observable<any>{
    let body = { data: {name } }
    let delet ={data:{hide:true}}
    return this.api.put<any>(`brands/${id}`,type=='update'?body:delet);
  }

}
