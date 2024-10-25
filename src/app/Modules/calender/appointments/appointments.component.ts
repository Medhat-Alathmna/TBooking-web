import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { id } from 'date-fns/locale';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { CalenderService } from '../calender.service';
import { Filter } from 'src/app/modals/filter';
import { Appointment } from 'src/app/modals/appoiments';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent extends BaseComponent implements OnInit {

  appointments: any
  showSppoSidebar: boolean = false
  paginator: boolean = true
  Appointment: any
  id
  rowNum: any = 10
  currentPage: any = 1
  total
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
  status = [
    { label: 'Completed' },
    { label: 'Draft' },
    { label: 'Canceled' }
  ]
  approvedList=[
    {label:'Approved',value:true},
    {label:'UnApproved',value:false}
  ]
  fillterFildes = {
    number: new Filter(),
    status: new Filter(),
    fromDate: new Filter(),
    customer: new Filter(),
    approved: new Filter()
  }

  @ViewChild('kt') table: any;

  constructor(public translates: TranslateService,
    public messageService: MessageService, private datePipe: DatePipe,private permisionServices:PermissionService,
     private calenderService: CalenderService) { super(messageService, translates) }

  ngOnInit(): void {
    this.clearAllFillter()
  }

  getAppointment(id) {
    this.id = id
    this.loading = true
    const subscription = this.calenderService.retreiveAppo(id).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.showSppoSidebar = true
      this.Appointment = results.data.attributes
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  clearAllFillter() {
    this.fillterFildes = {
      number: new Filter(),
      status: new Filter(),
      fromDate: new Filter(),
      customer: new Filter(),
      approved: new Filter()
    }
    this.calenderService.queryFilters = []
    this.getAppointments(1, null)
  }
  getAppointments(pageNum?: number, query?: any) {
    isSet(this.fillterFildes.fromDate.value) ? this.fillterFildes.fromDate.value = this.datePipe.transform(this.fillterFildes.fromDate.value, 'yyyy-MM-dd') : null
    this.loading = true
    const subscription = this.calenderService.getlist('appointments', pageNum, 10, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)|| !this.permisionServices.hasPermission('Appointments', 'view')) {
        return
      }
      this.paginator=true
      this.appointments = []
      const clone = Appointment.cloneManyObjects(results.data)
      this.total = results.meta.pagination.total
      if (!isSet(this.appointments)) {
        this.appointments = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.appointments[index] = item
        })
      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.appointments[index] = clone[cloneObjIndex++]
        }
      }
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
      subscription.unsubscribe()
    })
  }

  search() {
    this.loading = true
    const subscription = this.calenderService.search(this.fillterFildes.customer.value).subscribe((data: any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      this.paginator=false
      data.customer.map((x: any) => {
        console.log(x);
        
        x.attributes = x
      })
      this.appointments = data.customer
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
}
