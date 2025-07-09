import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { Vendor } from 'src/app/modals/vendors';
import { CalenderService } from '../../calender/calender.service';
import { Filter } from 'src/app/modals/filter';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss'],
})
export class VendorsListComponent extends BaseComponent implements OnInit {
  vendors: Vendor[] | any;
  rowNum: any = 10;
  currentPage: any = 1;
  total;
  paginator: boolean = true;
  showSidebar = false;
  detailMode: boolean = false;
  id;
  fillterFildes = {
    company: {name:'company',type:'$contains',filter:'text'},
    name: {name:'name',type:'$contains',filter:'text'},
    phone: {name:'phone',type:'$contains',filter:'text'},
    email: {name:'email',type:'$contains',filter:'text'},
    createdAt: new Filter(),
  };

  keys = [
    { header:this.lang=='en'? 'Vendor Name':'اسم المزود', key: 'name' },
    { header: this.lang=='en'?'Status':'الحالة', key: 'status' },
    { header: this.lang=='en'?'Email':'البريد الإلكتروني', key: 'email' },
    { header: this.lang=='en'?'Phone':'الهاتف', key: 'phone' },
    { header: this.lang=='en'?'Company':'الشركة', key: 'company' },
    { header: this.lang=='en'?'Company Phone':'هاتف الشركة', key: 'companyPhone' },
    { header: this.lang=='en'?'Address':'العنوان', key: 'address' },
    { header: this.lang=='en'?'Vendor Type':'نوع المزود', key: 'vendor_type.name' },
    { header:this.lang=='en'? 'Created At':'تاريخ الإنشاء', key: 'createdAt', format: 'YYYY-MM-DD HH:mm' },
  ]
  @ViewChild('kt') table: any;

  constructor(private calenderService: CalenderService) {
    super();
  }

  ngOnInit(): void {
    this.getVendorsList(1, null);
  }

  getVendorsList(pageNum?: number, query?: any,) {
    this.loading = true;
    const subscription = this.calenderService
      .getlist('vendors', pageNum, 10, query,'any')
      .subscribe(
        (results: any) => {
          this.loading = false;
          if (!isSet(results)) {
            return;
          }
          this.paginator = true;
          this.vendors = [];
          const clone = results.data;
          this.total = results.meta.pagination.total;
          if (!isSet(this.vendors)) {
            this.vendors = Array(this.total).fill(0);
          }
          if (clone.length < this.rowNum) {
            for (let index = clone.length; index < this.rowNum; index++) {
              clone[index] = null;
            }
          }
          if (!isSet(pageNum)) {
            clone.map((item, index) => {
              this.vendors[index] = item;
            });
          } else {
            const currentPage = pageNum * this.rowNum;
            let cloneObjIndex = 0;
            for (
              let index = currentPage - this.rowNum;
              index < currentPage;
              index++
            ) {
              this.vendors[index] = clone[cloneObjIndex++];
            }
          }
          //
          if (!isSet(this.vendors?.next)) {
            this.vendors = this.vendors.filter((item) => {
              return isSet(item);
            });
          }
          setTimeout(() => {
            this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0;
          });

          subscription.unsubscribe();
        },
        (error) => {
          this.loading = false;
          subscription.unsubscribe();
        }
      );
  }

  getVendor(data) {
    this.id = data.id;
    this.showSidebar = true;
    this.detailMode = true;
  }

  showVendorSidebar() {
    this.showSidebar = true;
    this.detailMode = false;
  }
  clearFilter(){
    this.calenderService.queryFilters = []
  }
}
