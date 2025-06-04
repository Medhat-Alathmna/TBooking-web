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

  getPurchaseOrders(pageNum?: number, query?: any) {        
    (query?.name=='createdAt'&& query)? (query.value = this.datePipe.transform(query.value,'yyyy-MM-dd')): null;
    
    this.loading = true;
    const subscription = this.calenderService
      .getlist('purchase-orders', pageNum, 10, query)
      .subscribe(
        (results: any) => {
          this.loading = false;
          if (!isSet(results)) {
            return;
          }
          this.paginator = true;
          this.purchaseOrders = [];
          const clone = results.data;
          this.total = results.meta.pagination.total;
          if (!isSet(this.purchaseOrders)) {
            this.purchaseOrders = Array(this.total).fill(0);
          }
          if (clone.length < this.rowNum) {
            for (let index = clone.length; index < this.rowNum; index++) {
              clone[index] = null;
            }
          }
          //
          if (!isSet(pageNum)) {
            clone.map((item, index) => {
              this.purchaseOrders[index] = item;
            });
          } else {
            const currentPage = pageNum * this.rowNum;
            let cloneObjIndex = 0;
            for (
              let index = currentPage - this.rowNum;
              index < currentPage;
              index++
            ) {
              this.purchaseOrders[index] = clone[cloneObjIndex++];
            }
          }
          //
          if (!isSet(this.purchaseOrders?.next)) {
            this.purchaseOrders = this.purchaseOrders.filter((item) => {
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
    this.getPurchaseOrders(1, null);
  }
}
