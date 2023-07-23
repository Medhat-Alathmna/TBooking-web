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
    public messageService: MessageService,private calenderService:CalenderService) { super(messageService, translates) }

  Appointments:Appointment[]=[]
  selectedViewType = this.trans('Monthly')
  tabSelected = 'calender'
  showSppoSidebar:boolean=false
  detailMode:boolean=false
  viewTypes = []
  employ: any = [
    {
    name: 'Leena',
    status:'Active',
    appo: [
      {
        id: 1,
        name: 'samar',
        dateTime: '20 / 7 / 2023',
        fromDate: '9:00',
        endDate: '11:30',
        service: 'Hair Cut',
        subService: 'Small Hair Cut',
        verified:true
      },
      {
        id: 2,
        name: 'Hanan',
        dateTime: '20 / 7 / 2023',
        fromDate: '9:30',
        endDate: '11:30',
        service: 'Massage',
        subService: 'Full Time Massage',
        verified:false
      },
    ]
  },
    {
    name: 'Am Myaar',
    status:'Active',
    appo: [
      {
        id: 1,
        name: 'SOsO',
        dateTime: '21 / 7 / 2023',
        fromDate: '9:00',
        endDate: '11:30',
        service: 'Hair Cut',
        subService: 'Small Hair Cut',
        verified:false
      },
      {
        id: 2,
        name: 'Sleena',
        dateTime: '21 / 7 / 2023',
        fromDate: '9:30',
        endDate: '11:30',
        service: 'Massage',
        subService: 'Full Time Massage',
        verified:true
      },
    ]
  }
]
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

        console.log(arg?.event);
        
        // console.log( arg?.event);
        
        // this.Appointment=arg?.event
        this.detailMode=true
        this.showSppoSidebar=true

      },
    }
    this.getActions()
    this.getCalender()
  }

  getCalender() {
    this.loading = true
    const subscription = this.calenderService.getAppominets().subscribe((results: Appointment[]) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.Appointments = Appointment.cloneManyObjects(results) 
      
      this.calendarOptions.events = []
    for (let index = 0; index < this.Appointments?.length; index++) {
      this.calendarOptions.events.push({
        id: this.Appointments[index].id,
        title: this.Appointments[index].First_Name,
        start: new Date(this.Appointments[index].FromTime),
        end: new Date(this.Appointments[index].ToTime),
        backgroundColor:"hsl(" + Math.random() * 360 + ", 100%, 75%)",
        borderColor: "hsl(" + Math.random() * 360 + ", 100%, 75%)",
      })
      
    }
    // console.log(this.datePipe.transform( this.Appointments[index].ToTime, 'dd-MM-yyyy hh:mm a'));

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
  openAppoDeatils(){
    this.detailMode=false

    this.showSppoSidebar=true
  }

}
