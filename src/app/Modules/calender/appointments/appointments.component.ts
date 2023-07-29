import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { id } from 'date-fns/locale';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { CalenderService } from '../calender.service';
import { Filter } from 'src/app/modals/filter';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent extends BaseComponent implements OnInit {

  appointments:any=[]
 rowNum: any = 10
 currentPage: any = 1
 total
 status=[
  {label:'Completed'},
  {label:'Draft'},
  {label:'Canceled'}
]
 fillterFildes = {
  number: new Filter(),
  status: new Filter(),
}

 @ViewChild('kt') table: any;

  constructor(public translates: TranslateService,
    public messageService: MessageService, private calenderService:CalenderService) {super(messageService,translates) }

  ngOnInit(): void {
    this.getAppointment(1)
  }
  clearAllFillter() {
    this.fillterFildes = {
      number: new Filter(),
      status: new Filter(),
    }
    this.calenderService.queryFilters = []
    this.getAppointment(1, null, false)
  }
  getAppointment(pageNum?: number, query?: any, reset?: boolean) {
    this.loading = true
    const subscription = this.calenderService.getlist('appointments',pageNum,10,query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);
      this.appointments=results.data
      this.total=results.meta.pagination.total
      if (reset) {
        this.appointments = Array(this.total).fill(0)
      }
      if (!isSet(this.appointments)) {
        this.appointments = Array(this.total).fill(0)
      }

      if (this.appointments.length < this.rowNum) {
        for (let index = this.appointments.length; index < this.rowNum; index++) {
          this.appointments[index] = null
        }
      }

      //
      if (!isSet(pageNum)) {
        this.appointments.map((item, index) => {
          this.appointments[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.appointments[index] = this.appointments[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.appointments?.next)) {
        this.appointments = this.appointments.filter(item => {
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
}
