import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { CalenderService } from '../../calender/calender.service';
import { Filter } from 'src/app/modals/filter';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
})
export class PurchaseOrderListComponent
  extends BaseComponent
  implements OnInit
{
  purchaseOrders;
  selectedPo;
  rowNum: any = 10;
  currentPage: any = 1;
  total;
  paginator: boolean = true;
  showSidebar = false;
  detailMode: boolean = false;
  fillterFildes = {
    no: { name: 'no', type: '$contains', filter: 'text' },
    createdAt:{ name: 'createdAt', filter: 'date' },
    status: {
      name: 'status',
      type: '$eq',
      filter: 'dropdown',
      data: [
        { label: 'Paid' },
        { label: 'Unpaid' },
        { label: 'Draft' },
        { label: 'Canceled' },
      ],
    },
    company: {
      name: 'company',
      type: '$contains',
      filter: 'text',
      parent: `[${'vendor'}]`,
    },
    addedToStuck: {
      name: 'addedToStuck',
      type: '$eq',
      filter: 'boolean',
     
    },
  };
  keys = [
    { header:this.lang=='en'? 'PO No':' رقم فاتورة مشتريات ' , key: 'no' },
    { header:this.lang=='en'? 'Vendor Name':'اسم المزود', key: 'vendor.name' },
    { header: this.lang=='en'?'Cash':'نقدي', key: 'cash' },
     { header: this.lang=='en'?'Payments':'الدفعات', key: 'payments.list' },
    { header: this.lang=='en'?'Status':'الحالة', key: 'status' },
    { header: this.lang=='en'?'Products (Sell Price)':'المنتج (سعر شراء)', key: 'products.sell' },
    { header: this.lang=='en'?'Products (QTY)':'المنتج (الكمية)', key: 'products.qty' },
    { header: this.lang=='en'?'Create By':'إنشاء بواسطة', key: 'createBy.username' },
    { header: this.lang=='en'?'Added to Stock':'مضاف إلى المخزن', key: 'addedToStuck' },
    { header:this.lang=='en'? 'Created At':'تاريخ الإنشاء', key: 'createdAt', format: 'YYYY-MM-DD HH:mm' },
  ]
 
  @ViewChild('kt') table: any;

  constructor(
    private calenderService: CalenderService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.clearAllFillter();
  }

  getPurchaseOrders(event,query) {
    (query?.name=='createdAt'&& query)? (query.value = this.datePipe.transform(query.value,'yyyy-MM-dd')): null;
    
const first = event?.first ?? 0;
const pageNum = first / this.rowNum + 1;
  this.loading = true;

  this.calenderService
    .getlist('purchase-orders', pageNum, this.rowNum,query)
    .subscribe({
      next: (results: any) => {
        this.purchaseOrders = results.data || [];
        this.total = results.meta?.pagination?.total || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  showPurSide() {
    this.selectedPo = null;
    this.showSidebar = true;
    this.detailMode = false;
  }

  openPO(id) {
    this.showSidebar = true;
    this.detailMode = true;
    this.selectedPo = id.id;
  }
  clearAllFillter() {
    this.calenderService.queryFilters = [];
    this.getPurchaseOrders(1,null);
  }
}
