import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import * as moment from 'moment';
import { CalenderService } from '../calender.service';
import { Appointment } from 'src/app/modals/appoiments';


@Component({
  selector: 'app-full-calender',
  templateUrl: './fullCalender.component.html',
  styleUrls: ['./fullCalender.component.scss']
})
export class FullCalenderComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService,
    public messageService: MessageService, private calenderService: CalenderService) { super(messageService, translates) }

  Appointments: any = []
  approvedAppointments: any = []
  unapprovedAppoit: any = []
  selectedViewType = this.trans('Monthly')
  id
  tabSelected = 'calender'
  showSppoSidebar: boolean = false
  detailMode: boolean = false
  viewTypes = []
  currentDate = moment(new Date(), 'MM-DD').locale(this.lang).format('Do MMM -dddd');
  calendarOptions: CalendarOptions
  tabIndex = [
    {
      label: 'Calender',
      command: event => {
        this.tabSelected = 'calender'
      }
    },
    {
      label: 'Employees',
      command: event => {
        this.tabSelected = 'employees'
      }
    }
  ]
  @Input() Appointment: any
  @ViewChild('calendar') calendar: FullCalendarComponent;
  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: false,
      height: '100%',
      editable: true,
      selectable: true,
      locale: this.lang,
      eventClick: (arg) => {
        this.getAppointment(arg?.event.id)
      },
    }
    this.getActions()
    this.getCalender()
    this.getunApprovedAppo()
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
    const subscription = this.calenderService.getApprovedAppominetsCalender().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.Appointments = results
     
      this.calendarOptions.events = []
      for (let index = 0; index < this.Appointments.data?.length; index++) {
        this.calendarOptions.events.push({
          id: this.Appointments.data[index].id,
          title: this.Appointments?.data[index]?.attributes?.employee?.data?.attributes?.username ?
           this.Appointments?.data[index]?.attributes?.employee?.data?.attributes?.username : 'No Employee yet',
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
      // const currentDate =moment(new Date().toISOString()).format('YYYY-MM-DD')
      // const result =  this.Appointments.data.filter(x=>{x.attributes.fromDate==currentDate;console.log(x);
      // })
      // console.log(result);
      console.log(this.Appointments);

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  getunApprovedAppo() {
    const currentDate =moment(new Date().toISOString()).format('YYYY-MM-DD')

    this.loading = true
    const subscription = this.calenderService.getUnApprovedAppominets(currentDate).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);
      this.unapprovedAppoit = results.data
      for (let index = 0; index < this.unapprovedAppoit?.length; index++) {
        this.unapprovedAppoit[index].attributes.fromDate = moment(this.unapprovedAppoit[index].attributes.fromDat).format('hh:mm A')
        this.unapprovedAppoit[index].attributes.toDate = moment(this.unapprovedAppoit[index].attributes.toDate).format('hh:mm A')
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  getActions() {
    setTimeout(() => {
      this.viewTypes = [
        {
          label: this.trans('Monthly'),
          command: () => {

            this.selectedViewType = this.trans('Monthly')
            this.calendar.getApi().changeView('dayGridMonth')
          }
        },
        {
          label: this.trans('Weekly'),
          command: () => {
            this.selectedViewType = this.trans('Weekly')

            this.calendar.getApi().changeView('timeGridWeek')
          }
        },
        {
          label: this.trans('Timely'),
          command: () => {
            this.selectedViewType = this.trans('Timely')

            this.calendar.getApi().changeView('timeGridDay')
          }
        },

      ]
    });
  }
  getNext() {
    this.calendar.getApi().next()
  }
  getPrev() {
    this.calendar.getApi().prev()
  }
  getCurrentDay() {
    this.calendar.getApi().today()
  }
  openAppoDeatils() {
    this.Appointment = null
    this.detailMode = false

    this.showSppoSidebar = true
  }

}
