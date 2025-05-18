import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';
import { Vendor } from 'src/app/modals/vendors';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  userAuth = JSON.parse(localStorage.getItem('userAuth'))?.user

  constructor(private api: ApiService) { }

    getVendorType(): Observable<any> {
      return this.api.get<any>(`vendor-types?sort[0]=createdAt:desc&pagination[pageSize]=1000&filters[hide][$eq]=false`);
    }

    createVendor(vendor: Vendor): Observable<any> {
        let body = {
          data: {
            name: vendor?.name,
            company: vendor?.company,
            address: vendor?.address,
            phone: vendor?.phone,
            companyPhone: vendor?.companyPhone,
            email: vendor?.email,
            isCompanyShow: vendor?.isCompanyShow,
            vendor_type: vendor?.vendorType.id,
            hide:false,
    
          }
        }
        return this.api.post<any>(`vendors`, body);
      }
      updateVendor(vendor: Vendor, id ,type): Observable<any> {

    let body = {
      data: {
        name: vendor?.name,
        company: vendor?.company,
        address: vendor?.address,
        phone: vendor?.phone,
        companyPhone: vendor?.companyPhone,
        email: vendor?.email,
        isCompanyShow: vendor?.isCompanyShow,
        vendor_type: vendor?.vendorType.id,
        hide:false,

      }
    }
    
    let delte ={data:{hide:true,deletedBy:this.userAuth.username}}
    return this.api.put<any>(`vendors/${id}`, type=='update'?body:delte);
  }
    createVendorType(name): Observable<any> {
      let body = { data: {name } }
      return this.api.post<any>(`vendor-types`, body);
    }
    updateVendorType(name,id,type?): Observable<any>{
      let body = { data: {name } }
      let delet ={data:{hide:true}}
      return this.api.put<any>(`vendor-types/${id}`,type=='update'?body:delet);
    }

    getVendor(id): Observable<any> {
      return this.api.get<any>(`vendors/${id}?populate=*`);
    }
    getVendorStatics(id,from,to): Observable<any> {
       const date = isSet(from) ? `?startDate=${from.toISOString()}&endDate=${to.toISOString()}` : ''
        return this.api.get<any>(`/statics/${id}${date}`);
    }
    
}
