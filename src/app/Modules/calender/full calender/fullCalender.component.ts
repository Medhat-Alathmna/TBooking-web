import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import * as moment from 'moment';
import { CalenderService } from '../calender.service';
import { DatePipe } from '@angular/common';
import { PermissionService } from 'src/app/core/permission.service';
import { SocketService } from 'src/app/Shared/socket.service';
import arLocale from '@fullcalendar/core/locales/ar';

@Component({
  selector: 'app-full-calender',
  templateUrl: './fullCalender.component.html',
  styleUrls: ['./fullCalender.component.scss']
})
export class FullCalenderComponent extends BaseComponent implements OnInit, AfterViewInit,AfterContentChecked {

  constructor(public translates: TranslateService,private cd: ChangeDetectorRef,private socketService:SocketService,
    public messageService: MessageService, private datePipe: DatePipe, private permisionServices:PermissionService,
     private calenderService: CalenderService) { super(messageService, translates) }
  private eventSource: EventSource | undefined;

  Appointments: any = []
  approvedAppointments: any = []
  unapprovedAppoit: any = []
  completedAppoit: any = []
  selectedViewType = this.trans('Timely')
  id
  tabSelected = 'calender'
  showSppoSidebar: boolean = false
  edpandMode: boolean = false
  detailMode: boolean = false
  selectDateMode: boolean = false
  viewTypes = []
  selectDate = new Date()
  calendarOptions: CalendarOptions
  activeIndex = 0
  tabIndex=[]
  notifications=[]
  Appointment: any
  inter
  @ViewChild('calendar') calendar: FullCalendarComponent;
  message
  ngAfterViewInit() {
    const tabViewNavCollection = document.getElementsByClassName('p-tabview-nav');
    tabViewNavCollection[0].classList.add("cal");

    
  }
   ngOnInit(): void {
    
setTimeout(() => {
  this.tabIndex=[
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
});
    this.calendarOptions = {
      initialView: 'timeGridDay',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
      },
       locales: [arLocale], 
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
    this.getTodayAppo()
    this.socketIOListner()
  //  this.inter= interval(5000).pipe(
      
  //     switchMap(() =>this.calenderService.getTodayAppominets(currentDate))  // Call the API at each interval
  //   ).subscribe(
  //     response => {
  //       console.log('API Response:', response); // Handle the API response
  //     },
  //     error => {
  //       console.error('API Error:', error);  // Handle any errors
  //     }
  //   );
    this.getCalender()
    // this.getNotfi()

  }
  ngAfterContentChecked() {
    this.cd.detectChanges();
  }
  // ngOnDestroy(): void {
  //  delete this.inter
  // }
  moveToDay() {
    this.calendar.getApi().gotoDate(new Date(this.selectDate))
    this.selectDateMode = false
  }
  expnd() {
    this.edpandMode = !this.edpandMode
    setTimeout(() => {
      this.calendar.getApi().today()
    }, 0);

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
      subscription.unsubscribe()
    })
  }
  getCalender() {
    this.loading = true
    const subscription = this.calenderService.getCalender().subscribe((results: any) => {
      this.loading = false
    if (!isSet(results) || !this.permisionServices?.hasPermission('Appointments', 'view')) {
        return
      }      
      this.Appointments = results
      this.calendarOptions.events = []
      for (let index = 0; index < this.Appointments.data?.length; index++) {
        const customer = this.Appointments?.data[index]?.attributes?.customer.firstName + ' ' + this.Appointments?.data[index]?.attributes?.customer.middleName + ' ' + this.Appointments?.data[index]?.attributes?.customer.lastName
        this.calendarOptions.events.push({
          id: this.Appointments.data[index].id,
          title: customer,
          // title: 'Medhat',
          start: new Date(this.Appointments.data[index].attributes.fromDate),
          end: new Date(this.Appointments.data[index].attributes.toDate),
          backgroundColor: this.Appointments?.data[index]?.attributes.status == 'Completed' ? '#66FF99' : "#e39dff",
          borderColor: this.Appointments?.data[index]?.attributes.status == 'Completed' ? '#66FF99' : "#e39dff",
        },
        )
        this.Appointments.data[index].attributes.fromDate = moment(this.Appointments.data[index].attributes.fromDate).format('hh:mm A')
        this.Appointments.data[index].attributes.toDate = moment(this.Appointments.data[index].attributes.toDate).format('hh:mm A')
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
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
      if (!isSet(results)|| !this.permisionServices.hasPermission('Appointments', 'view')) {
        return
      }
      let objects: any[] = []
      objects = results.data
      for (let index = 0; index < results.data?.length; index++) {
        results.data[index].attributes.fromDate = this.datePipe.transform(results.data[index].attributes.fromDate, 'hh:mm A')
      }      
      this.unapprovedAppoit = objects.filter(x => x.attributes.approved == false && x.attributes.status != 'Canceled')
      this.approvedAppointments = objects.filter(x => x.attributes.approved == true && x.attributes.status === 'Draft')
      this.completedAppoit = objects.filter(x => x.attributes.status === 'Completed')
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  getNotfi() {

    const subscription = this.calenderService.getNotfi().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      console.log(results);

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  openAppoDeatils() {
    this.Appointment = null
    this.detailMode = false

    this.showSppoSidebar = true
  }

  socketIOListner(){
  const sub=  this.socketService.socketIOEmitter.subscribe({next:(data)=>{
      if (!isSet(data)) {
        return
      }
      this.getTodayAppo()
    },
    complete:()=>{
      this.subscriptions.push(sub)
    }
  });
  }

}
