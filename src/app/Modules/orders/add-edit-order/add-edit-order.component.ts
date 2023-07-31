import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent } from 'src/app/core/base/base.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';

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

  acions:[]=[]
  @Input() selectedOrder:  any
  @Input() display: boolean = false
  @Input() detailMode: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService,public messageService: MessageService,) 
  {super(messageService, translates)  }

  ngOnInit(): void {
    this.selectedOrder.attributes.createdAt = moment( this.selectedOrder.attributes.createdAt).format('YYYY-MM-DD HH:ss')
    this.selectedOrder.attributes.appointment.data.attributes.fromDate = new Date( this.selectedOrder.attributes.appointment.data.attributes.fromDate)
    this.selectedOrder.attributes.appointment.data.attributes.toDate = new Date( this.selectedOrder.attributes.appointment.data.attributes.toDate)

  }
  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  getTotalPrice() {
    let totalAmount = 0
    this.selectedOrder.attributes.services?.map(x => {
      totalAmount += x.price
    })
    return totalAmount
  }
}
