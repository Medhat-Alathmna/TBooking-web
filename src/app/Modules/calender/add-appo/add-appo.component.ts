import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { FindUserComponent } from 'src/app/Shared/find-user/find-user.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { Appointment } from 'src/app/modals/appoiments';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { CalenderService } from '../calender.service';
import { startOfHour, addMinutes, format } from 'date-fns';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../users/users.service';
import * as moment from 'moment';
import { MobileService } from '../../mobile/mobile.service';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { OrdersService } from '../../orders/orders.service';


@Component({
  selector: 'app-add-appo',
  templateUrl: './add-appo.component.html',
  styleUrls: ['./add-appo.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    CalenderComponent,
    EntityViewerComponent,
    TextAreaComponent,
    ModalComponent,
    InputMaskComponent,
    LoadingComponent,
  ],
})
export class AddAppoComponent extends BaseComponent implements OnInit {

  users: any = []
  acions: any[] = []
  services: any = []
  selectEmployee: any
  selectServices: any = []
  showAddValue: boolean = false
  toOrderDialog: boolean = false
  body: string
  orderNo: string
  title: string
  newValue: any
  employeeMode: boolean = false
  closeCurrentTime = startOfHour(addMinutes(new Date(), Math.round(new Date().getMinutes() / 30) * 30));

  @Input() appointment: Appointment | any
  @Input() id: any
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('MultiSelect') MultiSelect: ElementRef;

  constructor(public translates: TranslateService,
    public messageService: MessageService, private cd: ChangeDetectorRef, private calenderService: CalenderService,
    private confirmationService: ConfirmationService, private mobileService: MobileService,private orderService:OrdersService
   ) { super(messageService, translates) }

  ngOnInit(): void {

    // this.appointment.employee= this.appointment?.employee.data.attributes
    this.getUsers()
    this.listServices()
    if (!this.detailMode || !this.appointment) {
      this.appointment = new Appointment
      setTimeout(() => {
        this.appointment.fromDate = this.closeCurrentTime
      }, 100);
      this.appointment.toDate = this.closeCurrentTime
      this.appointment.deposit = 0
      this.appointment.phone = 962
      this.appointment.number = moment(new Date ()).format('YY-MM-D')+'-00'

    } else {

      this.appointment = Appointment.cloneObject(this.appointment)
      this.appointment.firstName = this.appointment?.customer?.firstName
      this.appointment.middleName = this.appointment?.customer?.middleName
      this.appointment.lastName = this.appointment?.customer?.lastName
      this.appointment.fromDate = new Date(this.appointment.fromDate)
      this.appointment.toDate = new Date(this.appointment.toDate)
      this.appointment.createdAt = moment(this.appointment.createdAt).format('YYYY-MM-DD HH:ss')
      this.appointment.services.data.map(item => {
        this.selectServices.push({ id: item?.id, ar: item?.attributes?.ar, en: item?.attributes?.en, price: item?.attributes?.price })

      })      
      if (this.selectEmployee = this.appointment.employee) {
        this.selectEmployee = this.appointment?.employee?.data?.attributes
        this.employeeMode = true
      }
      if (!this.selectEmployee) {
        this.employeeMode = false
      }

      this.acions = [
        {
          label: this.appointment.approved ? 'Cancel the Appointment' : 'Convert to Approved',
          icon: 'pi pi-refresh',
          command: () => {
            this.appointment.approved ? this.confirmCancel() : this.convertApprove()
          }
        },
        {
          label: 'Convert to Order',
          icon: 'icon-news',
          command: () => {
            this.orderNo = moment(new Date ()).format('YY-MM-D')+'-00'
            this.toOrderDialog=true
          }
        },
        {
          label: 'Send Notification',
          icon: 'pi pi-whatsapp',
          command: () => {
            this.appointment.fromDate = moment(this.appointment.fromDate).format('YYYY-MM-DD HH:ss A')
            this.body = `مركز الجمال الفاخر يشعركم انه تم تأكيد موعدكم بتاريخ  ${this.appointment.fromDate} , يرجى الإلتزام بالموعد حتى لا نفتح رؤوسكم , و شكرا`
            window.open(`https://web.whatsapp.com/send?phone=${this.appointment.phone}&text=${this.body}`, "_blank")
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.confirm1Delete()
          }
        }
      ]
      if (!this.appointment.approved) {
        this.acions.splice(1, 2)
      }
    }



  }
  getTotalPrice() {
    let totalAmount = 0
    this.selectServices?.map(x => {
      totalAmount += x.price
    })
    return totalAmount
  }
  showAddNewServ() {
    this.title = 'Add New Services'
    this.showAddValue = true
    this.newValue = null
  }

  selectEmployees(event) {
    console.log(event);

    this.selectEmployee = event
    this.showAddValue = false
    this.employeeMode = true

  }
  selectService() {
    if (!isSet(this.selectServices)) {
      this.selectServices = []
    }
    const existServ = this.selectServices.find(x => x.id == this.newValue.id)
    if (existServ) {
      this.errorMessage('This Service Already Selected')
      return
    }
    this.selectServices.push(this.newValue)
    this.showAddValue = false
  }
  deleteValue(index) {
    this.selectServices.splice(index, 1)
  }


  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }

  startDateChange() {
    this.appointment.toDate = this.appointment.fromDate
  }

  finishDateChange() {
    if (this.appointment.toDate.getTime() < this.appointment.fromDate.getTime()) {
      setTimeout(() => {
        this.appointment.toDate = this.appointment.fromDate
      }, 2000);
      return this.errorMessage('Start Date Cant be greater than Finish Date')
    }

  }
  addAppominet() {
    this.appointment.deposit = !this.appointment.deposit ? 0 : this.appointment.deposit
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    this.appointment.services = this.selectServices
    this.loading = true
    const subscription = this.calenderService.addAppominets(this.appointment).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      this.loading = false

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateAppominet() {
    this.appointment.id = this.id
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    this.appointment.services = this.selectServices
    this.appointment.employee = this.selectEmployee

    this.loading = true
    const subscription = this.calenderService.updateAppointemt(this.appointment).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }


  getUsers() {
    const subscription = this.calenderService.getEmployee().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.users = data
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  listServices() {
    this.loading = true
    const subscription = this.mobileService.getServices().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      results.data.map(item => {
        this.services.push({ id: item?.id, ar: item?.attributes?.ar, en: item?.attributes?.en, price: item?.attributes?.price })

      })
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }

  convertApprove() {
    this.appointment.id = this.id
    this.appointment.approved = !this.appointment.approved
    this.loading = true
    const subscription = this.calenderService.approvedAction(this.appointment).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      // this.successMessage('This appontment has been converted')
      this.display=false
      this.refreshLish.emit(true)

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  confirm1Delete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Appontment ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteAppo() },
    });
  }
  deleteAppo() {
    this.appointment.id = this.id
    this.loading = true
    const subscription = this.calenderService.hideAppointment(this.appointment).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false

      // this.successMessage('The Appontment deleted successfully')
      this.display = false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      this.loading = false

      subscription.unsubscribe()
    })
  }
  completeAppointment() {
    this.appointment.id = this.id
    const subscription = this.calenderService.completeAppointment(this.appointment).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  confirmCancel() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel this Appontment ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.cancelAppointment() },
    });
  }

  cancelAppointment() {
    this.appointment.id = this.id
    this.appointment.status = 'Canceled'
    this.loading = true
    const subscription = this.calenderService.cancelAction(this.appointment).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.loading = false
      this.display = false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }

  addOrder(){
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    this.appointment.services = this.selectServices

    this.loading = true
    const subscription = this.orderService.addOrder(this.appointment,this.orderNo,this.getTotalPrice(),this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      console.log(data);
      
      this.completeAppointment()
      this.display = false
      this.loading = false
      this.refreshLish.emit(true)

      subscription.unsubscribe()
    }, error => {
      console.log(error);
      
      this.loading = false
      subscription.unsubscribe()
    })
  }

}
