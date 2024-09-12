import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { DashboardService } from '../dashboard.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { OrdersService } from '../../orders/orders.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  results: any = []
  items
  totalcash
  toDayChart
  basicOptions
  todayCashChart
  orderStutsChart
  fromDate: any = new Date()
  toDate: any = new Date()
  dashboardDatesDialog: boolean = false
  dashboardDetails: boolean = false
  role =JSON.parse(localStorage.getItem('role'))
  textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--surface-500')

  @ViewChild('printOrder') printOrder: ElementRef;

  constructor(public translates: TranslateService, public messageService: MessageService,private router:Router,private orderService:OrdersService,
    private dashboardService: DashboardService, private datePipe: DatePipe) { super(messageService, translates) }

  ngOnInit(): void {
    this.items = [
      {
        icon: 'pi pi-calendar text-primary',
        command: () => {
          this.dashboardDatesDialog = true
        }
      },
      {
        icon: 'pi pi-file text-primary',
        command: () => {
          this.dashboardDetails = true
        }
      },
      {
        icon: 'pi pi-refresh text-primary',
        command: () => {
          this.fromDate = new Date()
          this.toDate = new Date()
          this.count()
        }
      },

    ];
    if (this.role.name == 'Admin') {
      this.count()

    }else{
      this.orderService.checkRole.next(true)
      this.router.navigateByUrl('/calender')
    }
  }
  count() {
    this.loading = true
    const subscription = this.dashboardService.count(this.fromDate, this.toDate).subscribe((data: any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      this.results = data
      this.totalcash = data.sum
      this.toDayOrdersCharts()
      this.todayCashCharts()
      this.orderStutsCharts()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  toDayOrdersCharts() {
    this.toDayChart = {
      labels: [this.trans('Orders')],
      datasets: [
        {
          label: this.trans('Orders'),
          data: [this.results.entities.length],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };
    this.basicOptions = {
      plugins: { legend: { labels: { boxWidth: 10, color: this.textSecondaryColor } } },
      scales: {
        x: {
          ticks: {
            display: false,

          }, grid: { color: 'white' }
        },
        y: {
          grid: { color: 'white' }
        },


      }
    };
  }
  todayCashCharts() {
    this.todayCashChart = {
      labels: [this.trans(this.cur.name)],
      datasets: [
        {
          label:this.trans(this.cur.name) ,
          data: [this.totalcash],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };
    this.basicOptions = {
      plugins: { legend: { labels: { boxWidth: 10, color: this.textSecondaryColor } } },
      scales: {
        x: {
          ticks: {
            display: false,

          }, grid: { color: 'white' }
        },
        y: {
          grid: { color: 'white' }
        },


      }
    };
  }
  orderStutsCharts() {
    this.orderStutsChart = {
      labels: [this.trans('Paid'), this.trans('Unpaid'), this.trans('Draft'), this.trans('Canceled')],
      datasets: [
        {
          label: this.trans('Orders'),
          data: [this.results.paidLenght, this.results.unpaidLenght, this.results.draftLenght, this.results.canceldLenght],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(75, 192, 192)', 'rgb(255, 159, 64)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };
    this.basicOptions = {
      plugins: { legend: { labels: { boxWidth: 10, color: this.textSecondaryColor } } },
      scales: {
        x: {
          ticks: {
            display: true,

          }, grid: { color: 'white' }
        },
        y: {
          grid: { color: 'white' }
        },


      }
    };
  }
}
