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
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { OrdersService } from '../../orders/orders.service';
import { SettingsService } from '../../settings/settings.service';
import { Services } from 'src/app/modals/service';
import { Products } from 'src/app/modals/products';
import { PayByComponent } from 'src/app/Shared/pay-by/pay-by.component';
import { ProductsService } from '../../products/services.service';


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
    PayByComponent,
    InputMaskComponent,
    LoadingComponent,
  ],
})
export class AddAppoComponent extends BaseComponent implements OnInit {

  users: any = []
  acions: any[] = []
  services: Services[] = []
  Products: Products[] = []
  selectEmployee: any 
  newEmpe: any 
  selectServices: Services[] = []
  selectProducts: Products[] = []
  notfiItems: any = []
  showAddValue: boolean = false
  toOrderDialog: boolean = false
  showEmployiesDialog: boolean = false
  discountMode: string = 'type'
  cashMode: boolean = false
  servType: any
  body: string
  orderNo: string
  title: string
  newValue: any
  employeeMode: boolean = false
  showOrderSidebar: boolean = false
  closeCurrentTime = startOfHour(addMinutes(new Date(), Math.round(new Date().getMinutes() / 15) * 15));

  @Input() appointment: Appointment | any
  @Input() id: any
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();
  blockNumber = { number: null, name: null }


  @ViewChild('MultiSelect') MultiSelect: ElementRef;

  constructor(public translates: TranslateService,
    public messageService: MessageService, private cd: ChangeDetectorRef, private calenderService: CalenderService, private settingsService: SettingsService,
    private confirmationService: ConfirmationService, private productsService: ProductsService, private orderService: OrdersService
  ) { super(messageService, translates) }

  ngOnInit(): void {

    // this.appointment.employee= this.appointment?.employee.data.attributes
    this.getUsers()
    this.listServices()
    this.getProducts(1, null)
    if (!this.detailMode || !this.appointment) {
      this.appointment = new Appointment
      setTimeout(() => {
        this.appointment.fromDate = this.closeCurrentTime
      }, 100);
      this.appointment.toDate = this.closeCurrentTime
      this.appointment.deposit = 0
      this.appointment.employee = []
      this.appointment.phone = 962
      this.appointment.number = moment(new Date()).format('YY-MM-D') + '-00'
    } else {
      this.appointment = Appointment.cloneObject(this.appointment)
      this.appointment.firstName = this.appointment?.customer?.firstName
      this.appointment.middleName = this.appointment?.customer?.middleName
      this.appointment.lastName = this.appointment?.customer?.lastName
      this.appointment.fromDate = new Date(this.appointment.fromDate)
      this.appointment.toDate = new Date(this.appointment.toDate)
      this.appointment.createdAt = moment(this.appointment.createdAt).format('YYYY-MM-DD HH:ss')
      if (this.appointment.products) {
        this.appointment?.products?.map(item => {
          this.selectProducts.push({ id: item?.id, name: item?.name, stocks: item?.stocks, price: item?.price, qty: item?.qty, brand: item.brand })
        })
      }
      this.getNotfi()
      this.acions = [
        {
          label: this.appointment.approved ? this.trans('Cancel the Appointment') : this.trans('Convert to Approved'),
          icon: 'pi pi-refresh',
          command: () => {
            this.appointment.approved ? this.confirmCancel() : this.convertApprove()
          }
        },
        {
          label: this.trans('Convert to Order'),
          icon: 'pi pi-money-bill',
          command: () => {
            this.orderNo = this.appointment.number
            this.appointment.cash = 0
            this.appointment.discount = 0
            this.toOrderDialog = true
          }
        },
        {
          label: this.trans('Delete'),
          icon: 'pi pi-times',
          command: () => {
            this.confirm1Delete()
          }
        }
      ]
      if (!this.appointment.approved) {
        this.acions.splice(1, 1)
      }
      if (this.appointment.status == 'Canceled') {
        this.acions = [
          {
            label: this.trans('Block this customer'),
            icon: 'pi pi-minus-circle',
            command: () => {
              this.createForbidNumbers()
            }
          },
        ]
      }
    }

    console.log(this.appointment);
  }

  getTotalPrice() {
    let total = 0
    let serviceAmount: number = 0
    let productsAmount: number = 0
    this.appointment?.employee?.map(x => {
      x.services?.map(rs => {
        serviceAmount += rs?.price

      })
    })
    this.selectProducts?.map(x => {
      productsAmount += x?.price * x?.qty
    })
    const products = serviceAmount + productsAmount
    if (this.appointment.discountType == 'cash') {
      total = products - this.appointment.discount - this.appointment.cash - this.appointment.deposit
    } else {
      const cash = products - this.appointment.deposit
      total = (cash * ((100 - this.appointment.discount) / 100)) - this.appointment.cash
    }
    return {
      products, total

    }
  }
  showAddNewServ(type, index?) {
    this.title = type == 'ser' ? this.trans('New Service') : this.trans('New Product')
    if (!this.appointment.employee[index]?.services && type == 'ser') {
      this.appointment.employee[index] = Object.assign(this.appointment.employee[index], {
        services: []
      });
    }
    this.selectEmployee = index
    this.showAddValue = true
    this.newValue = ''
    this.servType = type
  }
  showAddNewEmp(type) {
    this.showEmployiesDialog = true

    this.newValue = null
  }

  selectEmployees(event) {
    if (!this.appointment.employee) this.appointment.employee=[]
    for (const employee of this.appointment.employee) {
      if (employee.username === event.username) {
        this.newEmpe = null
        this.errorMessage(this.trans('This employee has already been selected'))
        return;
      }
    }  
      this.appointment.employee.push(event)
    this.showAddValue = false
    this.showEmployiesDialog = false
    this.newEmpe = null
  }
  selectService() {
    if (!isSet(this.appointment.employee[this.selectEmployee].services)) {
      this.appointment.employee[this.selectEmployee].services = []
    }
    const existServ =this.appointment.employee[this.selectEmployee].services.find(x => x.id == this.newValue.id)    
    if (existServ) {
      this.errorMessage(this.trans('This Service Already Selected'))
      return
    }
    this.appointment.employee[this.selectEmployee].services.push({
      id: this.newValue?.id,
      ar: this.newValue?.ar,
      en: this.newValue?.en,
      price: this.newValue?.price
    }
    );
    this.showAddValue = false
  }
  selectProduct() {
    if (!isSet(this.selectProducts)) {
      this.selectProducts = []
    }
    if (this.newValue.stocks == 0) {
      this.errorMessage(this.trans('This Product Out of stock'))
      return
    }
    const existServ = this.selectProducts.find(x => x.id == this.newValue.id)
    if (existServ) {
      this.errorMessage(this.trans('This Product Already Selected'))
      return
    }
    this.selectProducts.push(Products.cloneObject({
      id: this.newValue?.id,
      name: this.newValue?.name,
      stocks: this.newValue?.stocks,
      brand: this.newValue?.brand,
      qty: 1,
      price: this.newValue?.price
    }))
    this.showAddValue = false
    this.newValue = null
  }
  deleteValue(index, type) {
    type == 'emp' ? this.appointment.employee.splice(index, 1) : this.selectProducts.splice(index, 1)
  }
  deleteValueServ(i, child) {
    this.appointment.employee[i].services.splice(child, 1)
  }
  checkStock() {
    this.selectProducts.map(prod => {
      if (prod.qty > prod.stocks) {
        setTimeout(() => {
          prod.qty = prod.stocks
          this.errorMessage(this.trans('The Quantity must not be more than Stocks'))
        }, 300);
      }
    })
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
    this.appointment.products = this.selectProducts
    this.loading = true
    const subscription = this.calenderService.addAppominets(this.appointment).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.refreshLish.emit(true)
      this.display = false
      this.loading = false
      this.successMessage(null,'The Appoiment has been Created')
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateAppominet() {
    if ((this.userAuth.username != this.appointment?.appoBy)&&(this.role?.name != 'Admin')) {
      this.errorMessage(this.trans('You do not have permission to modify this appointment'))
      return
    }
    this.appointment.id = this.id
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    this.appointment.products = this.selectProducts
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
    const subscription = this.productsService.getServices().subscribe((results: any) => {
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
      this.acions = [
        {
          label: this.appointment.approved ? this.trans('Cancel the Appointment') : this.trans('Convert to Approved'),
          icon: 'pi pi-refresh',
          command: () => {
            this.appointment.approved ? this.confirmCancel() : this.convertApprove()
          }
        },
        {
          label: this.trans('Convert to Order'),
          icon: 'pi pi-money-bill',
          command: () => {
            this.orderNo = moment(new Date()).format('YY-MM-D') + '-00'
            this.toOrderDialog = true
          }
        },
        {
          label: this.trans('Delete'),
          icon: 'pi pi-times',
          command: () => {
            this.confirm1Delete()
          }
        }
      ]
      console.log(results);
      this.appointment = Appointment.cloneObject(results.data.attributes)
      this.appointment.firstName = this.appointment?.customer?.firstName
      this.appointment.middleName = this.appointment?.customer?.middleName
      this.appointment.lastName = this.appointment?.customer?.lastName
      this.appointment.fromDate = new Date(this.appointment.fromDate)
      this.appointment.toDate = new Date(this.appointment.toDate)
      this.appointment.createdAt = moment(this.appointment.createdAt).format('YYYY-MM-DD HH:ss')
      if (this.appointment.products) {
        this.appointment?.products?.map(item => {
          this.selectProducts.push({ id: item?.id, name: item?.name, stocks: item?.stocks, price: item?.price, qty: item?.qty, brand: item.brand })
        })
      }
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
      message: this.trans('Are you sure that you want to delete this Appontment ?'),
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
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
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

  addOrder() {
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    this.appointment.products = this.selectProducts
    this.appointment.status = this.getTotalPrice().total == 0 ? "Paid" : "Unpaid"
    if (!this.appointment.employee) {
      this.errorMessage('Please choose Employee !')
    }
    this.loading = true
    const subscription = this.orderService.addOrder(this.appointment, this.orderNo, this.getTotalPrice(), this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      if (this.selectProducts.length) {
        this.selectProducts.map(prod => {  
          this.updateProduct(prod, prod.id)
        })
      }
      this.completeAppointment()
      this.loading = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  getNotfi() {
    const subscription = this.settingsService.getNotifications().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      var arr = results.data.filter(x => x.attributes.type == 'Appointment')
      arr.map(notf => {
        this.notfiItems.push({
          label: notf.attributes.title, command: () => {
            var body = this.replaceValuesStrings(notf.attributes.body)
            window.open(`https://web.whatsapp.com/send?phone=${this.appointment.phone}&text=${body}`, "_blank")
          }
        })
      })
      subscription.unsubscribe()
    }, error => {
      console.log(error);
      subscription.unsubscribe()
    })
  }

  replaceValuesStrings(body) {
    var startDate = moment(this.appointment.fromDate).format('YYYY-MM-D')
    var startTime = moment(this.appointment.fromDate).format('HH-MM A')
    var customer = this.appointment.firstName + ' ' + this.appointment.middleName + ' ' + this.appointment.lastName
    var number = this.appointment.number
    var notes = this.appointment.notes
    var employee = this.appointment.employee
    var deposit = this.appointment.deposit
    var mapObj = { $date: startDate, $time: startTime, $customer: customer, $number: number, $notes: notes, $employee: employee, $deposit: deposit + ' دينار', $price: this.getTotalPrice() + ' دينار' };
    return body = this.multiReplace(body, mapObj)
  }

  createForbidNumbers() {
    this.blockNumber.number = this.appointment.phone
    this.blockNumber.name = this.appointment.customer.firstName + ' ' + this.appointment.customer.middleName + ' ' + this.appointment.customer.lastName
    this.loading = true
    const subscription = this.settingsService.createForbidNumbers(this.blockNumber).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  getProducts(pageNum?: number, query?: any) {
    this.loading = true
    const subscription = this.calenderService.getlist('products', pageNum, 1000, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);


      results.data.map(item => {
        this.Products.push({ id: item?.id, name: item?.attributes?.name, stocks: item?.attributes?.stocks, price: item?.attributes?.price, brand: item?.attributes?.brand?.data?.attributes })
      })

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  updateProduct(prod, id) {
    const subscription = this.calenderService.updateProduct(prod, id).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  onKeyEnter(event, type?) {
    if (event.keyCode === 13) {
      type == 'cash' ? this.cashMode = false : this.discountMode = 'show'
    }
  }

}
