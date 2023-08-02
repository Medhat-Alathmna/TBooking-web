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
  discountMode: boolean = false
  cashMode: boolean = false
  body: string
  @Input() selectedOrder: Order
  @Input() display: boolean = false
  @Input() detailMode: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService,
    public messageService: MessageService, private orderService: OrdersService,
    private confirmationService: ConfirmationService,) { super(messageService, translates) }

  ngOnInit(): void {
    this.selectedOrder.attributes.createdAt = moment(this.selectedOrder.attributes.createdAt).format('YYYY-MM-DD HH:ss')
    this.selectedOrder.attributes.appointment.data.attributes.fromDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.fromDate)
    this.selectedOrder.attributes.appointment.data.attributes.toDate = new Date(this.selectedOrder.attributes.appointment.data.attributes.toDate)
    this.selectedOrder.discount=!this.selectedOrder.attributes.discount?0:this.selectedOrder.attributes.discount
    this.selectedOrder.cash=!this.selectedOrder.attributes.cash?0:this.selectedOrder.attributes.cash
    this.acions = [
      {
        label: 'Send Notification',
        icon: 'pi pi-whatsapp',
        command: () => {
          window.open(`https://web.whatsapp.com/send?phone=${this.selectedOrder.attributes.appointment.data.attributes.phone}&text=${this.body}`, "_blank")
        }
      },
      {
        label: 'Cancel the Order',
        icon: 'pi pi-trash',
        command: () => {
          this.confirm1Cancel()
        }
      },

    ]
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
    total = totalServicesAmount - this.selectedOrder.discount - this.selectedOrder.cash - this.selectedOrder.attributes.appointment.data.attributes.deposit
    return {
      totalServicesAmount, total

    }
  }
  onKeyEnter(event) {
    if (event.keyCode === 13) {
      this.discountMode = false
      this.cashMode = false
    }
  }

  updateOrder() {
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
      accept: () => { this.cancelOrder();this.draftAppointment() },
    });
  }
}
