import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { OrdersService } from '../orders.service';
import { CalenderService } from '../../calender/calender.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends BaseComponent implements OnInit {

  rowNum: any = 10
  currentPage: any = 1
  orders:any=[]
  total
  showOrderSidebar:boolean=false
  selectedOrder

  @ViewChild('kt') table: any;

  constructor(public translates: TranslateService,
    public messageService: MessageService,private ordersService:OrdersService,
    private calenderService:CalenderService,) {super(messageService, translates) }

  ngOnInit(): void {
    this.getOrders(1,null,false)
  }
  getOrders(pageNum?: number, query?: any, reset?: boolean) {
    this.loading = true
    const subscription = this.calenderService.getlist('orders',pageNum,10,query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);
      this.orders=results.data
      this.total=results.meta.pagination.total
      if (reset) {
        this.orders = Array(this.total).fill(0)
      }
      if (!isSet(this.orders)) {
        this.orders = Array(this.total).fill(0)
      }

      if (this.orders.length < this.rowNum) {
        for (let index = this.orders.length; index < this.rowNum; index++) {
          this.orders[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        this.orders.map((item, index) => {
          this.orders[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.orders[index] = this.orders[cloneObjIndex++]
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
      console.log(error);
      subscription.unsubscribe()
    })
  }

  getOrder(order){
    console.log(order);
    
    this.selectedOrder=order
    this.showOrderSidebar=true
  }
}
