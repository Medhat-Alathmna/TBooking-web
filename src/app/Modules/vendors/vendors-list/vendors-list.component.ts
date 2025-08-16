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
    company: { name: 'company', type: '$contains', filter: 'text' },
    name: { name: 'name', type: '$contains', filter: 'text' },
    phone: { name: 'phone', type: '$contains', filter: 'text' },
    email: { name: 'email', type: '$contains', filter: 'text' },
    createdAt: new Filter(),
  };

  keys = [
    { header: this.lang == 'en' ? 'Vendor Name' : 'اسم المزود', key: 'name' },
    { header: this.lang == 'en' ? 'Status' : 'الحالة', key: 'status' },
    { header: this.lang == 'en' ? 'Email' : 'البريد الإلكتروني', key: 'email' },
    { header: this.lang == 'en' ? 'Phone' : 'الهاتف', key: 'phone' },
    { header: this.lang == 'en' ? 'Company' : 'الشركة', key: 'company' },
    { header: this.lang == 'en' ? 'Company Phone' : 'هاتف الشركة', key: 'companyPhone' },
    { header: this.lang == 'en' ? 'Address' : 'العنوان', key: 'address' },
    { header: this.lang == 'en' ? 'Vendor Type' : 'نوع المزود', key: 'vendor_type.name' },
    { header: this.lang == 'en' ? 'Created At' : 'تاريخ الإنشاء', key: 'createdAt', format: 'YYYY-MM-DD HH:mm' },
  ]
  @ViewChild('kt') table: any;

  constructor(private calenderService: CalenderService) {
    super();
  }

  ngOnInit(): void {
    this.getVendorsList(1, null);
  }

  getVendorsList(event, query) {
    const first = event?.first ?? 0;
    const pageNum = first / this.rowNum + 1;
    this.loading = true;

    const subscribe = this.calenderService.getlist('vendors', pageNum, this.rowNum, query).subscribe({
      next: (results: any) => {
        this.vendors = results.data || [];
        this.total = results.meta?.pagination?.total || 0;
      },
      complete: () => {
        this.loading = false;
        subscribe.unsubscribe()
      }
    });
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
  clearFilter() {
    this.calenderService.queryFilters = []
  }
}
