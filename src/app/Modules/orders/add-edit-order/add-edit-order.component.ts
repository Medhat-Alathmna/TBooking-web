import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { OrdersService } from '../orders.service';
import { th } from 'date-fns/locale';
import { Order } from 'src/app/modals/order';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.scss'],
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
export class AddEditOrderComponent extends BaseComponent implements OnInit {

  acions: any[] = []
  notfiItems: any = []
  discountMode: string = 'type'
  cashMode: boolean = false
  body: string
  @Input() selectedOrder: Order
  @Input() display: boolean = false
  @Input() detailMode: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translate: TranslateService,
    public messageService: MessageService, private orderService: OrdersService, private settingsService: SettingsService,
    private confirmationService: ConfirmationService,) { super(messageService, translate) }

  ngOnInit(): void {
    this.selectedOrder.attributes.createdAt = moment(this.selectedOrder.attributes.createdAt).format('YYYY-MM-DD HH:ss')
    this.selectedOrder.attributes.appointment.data.attributes.fromDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.fromDate)
    this.selectedOrder.attributes.appointment.data.attributes.toDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.toDate)
    this.selectedOrder.discount = !this.selectedOrder.attributes.discount ? 0 : this.selectedOrder.attributes.discount
    this.selectedOrder.cash = !this.selectedOrder.attributes.cash ? 0 : this.selectedOrder.attributes.cash
    if (this.selectedOrder.attributes.discountType) {
      this.selectedOrder.discountType=this.selectedOrder.attributes.discountType
      this.discountMode='show'
    }
   console.log( this.selectedOrder);
   
    this.acions = [
      {
        label: 'Cancel the Order',
        icon: 'pi pi-trash',
        command: () => {
          this.confirm1Cancel()
        }
      },

    ]
    this.getNotfi()
 
  }
  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  getTotalPrice() {
    let totalServicesAmount = 0
    let total = 0
    this.selectedOrder.attributes.services?.map(x => {
      totalServicesAmount += x.price
    })
    if (this.selectedOrder.discountType == 'cash') {
      total = totalServicesAmount - this.selectedOrder.discount - this.selectedOrder.cash - this.selectedOrder.attributes.appointment.data.attributes.deposit
    } else {
      const cash = totalServicesAmount  - this.selectedOrder.attributes.appointment.data.attributes.deposit
      total = (cash * ((100 - this.selectedOrder.discount) / 100))-this.selectedOrder.cash
    }
    return {
      totalServicesAmount, total

    }
  }
  onKeyEnter(event,type?) {
    if (event.keyCode === 13) {
      type=='cash'?this.cashMode = false:this.discountMode = 'show'

      
    }
  }

  updateOrder() {
    if (this.getTotalPrice().total < 0) {
      this.errorMessage('Total Price can not be less than 0')
      return
    }
    this.selectedOrder.status = this.getTotalPrice().total == 0 ? "Paid" : "Unpaid"
    this.loading = true
    const subscription = this.orderService.updateOrder(this.selectedOrder).subscribe((data) => {
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

  cancelOrder() {
    this.loading = true
    const subscription = this.orderService.cancelOrder(this.selectedOrder).subscribe((data) => {
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

  draftAppointment() {
    const subscription = this.orderService.draftAppointment(this.selectedOrder.attributes.appointment.data).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  confirm1Cancel() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel this Order ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.cancelOrder(); this.draftAppointment() },
    });
  }
  replaceValuesStrings(body) {
    var startDate = moment(this.selectedOrder.attributes.appointment.data.attributes.fromDate).format('YYYY-MM-D')
    var startTime = moment(this.selectedOrder.attributes.appointment.data.attributes.fromDate).format('HH-MM A')
    var customer = this.selectedOrder.attributes.appointment.data.attributes.customer.firstName + ' ' + this.selectedOrder.attributes.appointment.data.attributes.customer.middleName + ' ' + this.selectedOrder.attributes.appointment.data.attributes.customer.lastName
    var number = this.selectedOrder.attributes.orderNo
    var notes = this.selectedOrder.attributes.notes
    var cash = this.selectedOrder.cash
    var discount = this.selectedOrder.discount
    var employee = this.selectedOrder.attributes.appointment.data.attributes.employee
    var deposit = this.selectedOrder.attributes.appointment.data.attributes.deposit
    var mapObj = { $date: startDate, $time: startTime, $customer: customer, $number: number, $notes: notes, $employee: employee, $discount: discount + ' دينار', $cash: cash + ' دينار', $deposit: deposit + ' دينار' };
    return body = this.multiReplace(body, mapObj)
  }
  getNotfi() {
    const subscription = this.settingsService.getNotifications().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      var arr = results.data.filter(x => x.attributes.type == 'Orders')
      arr.map(notf => {
        this.notfiItems.push({
          label: notf.attributes.title, command: () => {
            var body = this.replaceValuesStrings(notf.attributes.body)
            window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.attributes.appointment.data.attributes.phone}&text=${body}`, "_blank")
          }
        })
      })
      subscription.unsubscribe()
    }, error => {
      console.log(error);
      subscription.unsubscribe()
    })
  }
}
