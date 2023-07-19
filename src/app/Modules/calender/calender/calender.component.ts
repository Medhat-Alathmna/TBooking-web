import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/core/base/base.component';
import * as moment from 'moment';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService, public messageService: MessageService,) { super(messageService, translates) }

  selectedViewType = this.trans('Monthly')
  tabSelected = 'calender'
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

  @ViewChild('calendar') calendar: FullCalendarComponent;

  ngOnInit(): void {
    this.calendarOptions = {
      headerToolbar: false,
      height: '100%',
      editable: true,
      selectable: true,
      locale: this.lang,
      events: [
        { title: 'event 1', date: '2023-07-01' },
        { title: 'event 2', date: '2023-07-02' }
      ]
      // eventClick: (arg) => {
      //   this.meetClick.emit(arg?.event?.id)
      // },
      // eventDrop: (arg) => {
      //   this.meetingDrop(arg.event)
      // },


    }
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
}
