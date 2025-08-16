import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { OrdersService } from '../orders.service';
import { CalenderService } from '../../calender/calender.service';
import { Filter } from 'src/app/modals/filter';
import { Order } from 'src/app/modals/order';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends BaseComponent implements OnInit {
  userInput: string = '';
  messages: { sender: 'user' | 'ai', text: string }[] = [];
  rowNum: any = 10
  currentPage: any = 1
  orders: any = []
  selectedKey
  searchCustomer
  total
  showOrderSidebar: boolean = false
  paginator: boolean = true
  selectedOrder
  fillterFildes = {
    orderNo: new Filter(),
    status: new Filter(),
    customer: new Filter(),
    number: new Filter(),
    createdAt: new Filter(),
    name: new Filter(),
  }
  keys = [
    { header:this.lang=='en'? 'Order No':'رقم الفاتورة', key: 'orderNo' },
    { header:this.lang=='en'? 'Customer Name':'اسم زبون', key: 'appointment.customer.fullName' },
    { header: this.lang=='en'?'Status':'الحالة', key: 'status' },
    { header:this.lang=='en'? 'Created At':'تاريخ الإنشاء', key: 'createdAt', format: 'YYYY-MM-DD HH:mm' },
  ]
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

  constructor(public translates: TranslateService, private http: HttpClient,
    public messageService: MessageService, private ordersService: OrdersService, private datePipe: DatePipe,
    private calenderService: CalenderService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.clearAllFillter()
  }



  getOrders(event, query) {
    isSet(this.fillterFildes.createdAt.value) ? this.fillterFildes.createdAt.value = this.datePipe.transform(this.fillterFildes.createdAt.value, 'yyyy-MM-dd') : null

    const first = event?.first ?? 0;
    const pageNum = first / this.rowNum + 1;
    this.loading = true;

    const sub = this.calenderService.getlist('orders', pageNum, this.rowNum, query).subscribe({
      next: (results: any) => {
        this.orders = results.data || [];
        this.total = results.meta?.pagination?.total || 0;
      },
      complete: () => {
        this.loading = false;
        sub.unsubscribe()
      }
    });
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
      this.paginator = false
      data.customer.map((x: any) => {
        x.attributes = x;
        x.attributes.appointment.data = x?.appointment
        x.attributes.appointment.data.attributes = x.attributes.appointment.data
      })
      this.orders = data.customer
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }



}
