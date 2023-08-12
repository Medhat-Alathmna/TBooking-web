import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import * as moment from 'moment';
import { CalenderService } from '../calender.service';
import { Appointment } from 'src/app/modals/appoiments';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';


@Component({
  selector: 'app-full-calender',
  templateUrl: './fullCalender.component.html',
  styleUrls: ['./fullCalender.component.scss']
})
export class FullCalenderComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService,
    public messageService: MessageService, private datePipe: DatePipe, private calenderService: CalenderService) { super(messageService, translates) }

  Appointments: any = []
  approvedAppointments: any = []
  unapprovedAppoit: any = []
  completedAppoit: any = []
  selectedViewType = this.trans('Timely')
  id
  tabSelected = 'calender'
  showSppoSidebar: boolean = false
  detailMode: boolean = false
  selectDateMode: boolean = false
  viewTypes = []
  selectDate = new Date()
  calendarOptions: CalendarOptions
  tabIndex = [
    {
      label: this.trans('Calender'),
      command: event => {
        this.tabSelected = 'calender'
      }
    },
    {
      label: this.trans('Appointments'),
      command: event => {
        this.tabSelected = 'appointments'
      }
    },
  ]
  Appointment: any
  @ViewChild('calendar') calendar: FullCalendarComponent;
  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'timeGridDay',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
      },
      titleFormat: { year: 'numeric', day: 'numeric', month: 'numeric', },
      height: '100%',
      editable: true,
      direction: this.lang == 'ar' ? 'rtl' : 'ltr',
      selectable: true,
      locale: this.lang,
      eventClick: (arg) => {
        this.getAppointment(arg?.event.id)
      },
    }
    this.getCalender()
    this.getTodayAppo()
  }
  moveToDay() {
    this.calendar.getApi().gotoDate(new Date(this.selectDate))
    this.selectDateMode = false
  }
  getAppointment(id) {
    this.id = id
    this.loading = true
    const subscription = this.calenderService.retreiveAppo(id).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.detailMode = true
      this.showSppoSidebar = true
      this.Appointment = results.data.attributes
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  getCalender() {
    this.loading = true
    const subscription = this.calenderService.getCalender().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.Appointments = results
      this.calendarOptions.events = []
      for (let index = 0; index < this.Appointments.data?.length; index++) {
        const customer = this.Appointments?.data[index]?.attributes?.customer.firstName + ' ' + this.Appointments?.data[index]?.attributes?.customer.middleName + ' ' + this.Appointments?.data[index]?.attributes?.customer.lastName
        console.log(customer);

        this.calendarOptions.events.push({
          id: this.Appointments.data[index].id,
          title: this.Appointments?.data[index]?.attributes?.employee?.data?.attributes?.username ?
            this.Appointments?.data[index]?.attributes?.employee?.data?.attributes?.username + '  (' + customer + '  )' : 'No Employee yet',
          // title: 'Medhat',
          start: new Date(this.Appointments.data[index].attributes.fromDate),
          end: new Date(this.Appointments.data[index].attributes.toDate),
          backgroundColor: "hsl(" + Math.random() * 360 + ", 100%, 75%)",
          borderColor: "hsl(" + Math.random() * 360 + ", 100%, 75%)",
        },

        )


        this.Appointments.data[index].attributes.fromDate = moment(this.Appointments.data[index].attributes.fromDate).format('hh:mm A')
        this.Appointments.data[index].attributes.toDate = moment(this.Appointments.data[index].attributes.toDate).format('hh:mm A')
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  getTodayAppo() {
    const currentDate = moment(new Date()).format('YYYY-MM-DDT00:00')
    this.unapprovedAppoit = []
    this.approvedAppointments = []
    this.completedAppoit = []

    this.loading = true
    const subscription = this.calenderService.getTodayAppominets(currentDate).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      let objects: any[] = []
      objects = results.data
      for (let index = 0; index < results.data?.length; index++) {
        results.data[index].attributes.fromDate = this.datePipe.transform(results.data[index].attributes.fromDate, 'hh:mm A')
      }

      this.unapprovedAppoit = objects.filter(x => x.attributes.approved == false)
      this.approvedAppointments = objects.filter(x => x.attributes.approved == true && x.attributes.status === 'Draft')
      this.completedAppoit = objects.filter(x => x.attributes.status === 'Completed')
      console.log(this.completedAppoit);

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }

  openAppoDeatils() {
    this.Appointment = null
    this.detailMode = false

    this.showSppoSidebar = true
  }

}
