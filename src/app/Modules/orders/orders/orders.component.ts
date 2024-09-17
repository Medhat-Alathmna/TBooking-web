import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { OrdersService } from '../orders.service';
import { CalenderService } from '../../calender/calender.service';
import { Filter } from 'src/app/modals/filter';
import { Order } from 'src/app/modals/order';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends BaseComponent implements OnInit {

  rowNum: any = 10
  currentPage: any = 1
  orders: any = []
  searchCustomer
  total
  showOrderSidebar: boolean = false
  selectedOrder
  fillterFildes = {
    orderNo: new Filter(),
    status: new Filter(),
    customer: new Filter(),
    number: new Filter(),
    createdAt: new Filter(),
    name: new Filter(),
  }
  status = [
    { label: 'Paid' },
    { label: 'Unpaid' },
    { label: 'Draft' },
    { label: 'Canceled' }
  ]

  queryTypes = [

    {
      type: 'Not Equal',
      value: '$ne'
    },
    {
      type: 'Equal',
      value: '$containsi'
    },
    {
      type: 'Less than',
      value: '$lte'
    },
    {
      type: 'Greater Than',
      value: '$gte'
    },

  ]
  @ViewChild('kt') table: any;

  constructor(public translates: TranslateService,
    public messageService: MessageService, private ordersService: OrdersService, private datePipe: DatePipe,
    private calenderService: CalenderService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.clearAllFillter()
  }
  getOrders(pageNum?: number, query?: any) {
    isSet(this.fillterFildes.createdAt.value) ? this.fillterFildes.createdAt.value = this.datePipe.transform(this.fillterFildes.createdAt.value, 'yyyy-MM-dd') : null

    this.loading = true
    const subscription = this.calenderService.getlist('orders', pageNum, 10, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      const clone = results.data
      this.total = results.meta.pagination.total
      if (!isSet(this.orders)) {
        this.orders = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.orders[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.orders[index] = clone[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.orders?.next)) {
        this.orders = this.orders.filter(item => {
          return isSet(item)
        })
      }
      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  getOrder(order) {
    this.selectedOrder = order
    this.showOrderSidebar = true
  }

  clearAllFillter() {
    this.fillterFildes = {
      orderNo: new Filter(),
      status: new Filter(),
      number: new Filter(),
      customer: new Filter(),
      name: new Filter(),
      createdAt: new Filter(),
    }
    this.calenderService.queryFilters = []
    this.getOrders(1, null)
  }
  search() {
    this.loading = true
    const subscription = this.ordersService.search(this.fillterFildes.customer.value).subscribe((data: any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      data.customer.map((x: any) => {
        x.attributes = x;
        x.attributes.appointment.data = x?.appointment
        x.attributes.appointment.data.attributes = x.attributes.appointment.data
      })
      this.orders = data.customer
      console.log(this.orders );
      
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
}
