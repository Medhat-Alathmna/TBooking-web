import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
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
import { DropdownComponent } from 'src/app/Shared/dropdown/dropdown.component';
import { startOfHour, addMinutes, format } from 'date-fns';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../users/users.service';


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
    DropdownComponent,
    EntityViewerComponent,
    TextAreaComponent,
    LoadingComponent,
  ],
})
export class AddAppoComponent extends BaseComponent implements OnInit {

  users: any[] = []

  closeCurrentTime = startOfHour(addMinutes(new Date(), Math.round(new Date().getMinutes() / 30) * 30));

  @Input() appointment: Appointment
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService,
    public messageService: MessageService, private calenderService: CalenderService,
     private datePipe: DatePipe, private userServices: UsersService) { super(messageService, translates) }

  ngOnInit(): void {
    if (!this.detailMode || !this.appointment) {
      this.appointment = new Appointment
      this.appointment.FromTime = this.closeCurrentTime
      this.appointment.ToTime = this.closeCurrentTime
    }
    this.getUsers()
  }

  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }

  startDateChange() {
    this.appointment.ToTime = this.appointment.FromTime
  }

  finishDateChange() {
    if (this.appointment.ToTime.getTime() < this.appointment.FromTime.getTime()) {
      setTimeout(() => {
        this.appointment.ToTime = this.appointment.FromTime
      }, 2000);
      return this.errorMessage('Start Date Cant be greater than Finish Date')
    }

  }
  addAppominet() {
    this.appointment.FromTime = this.datePipe.transform(this.appointment.FromTime, 'yyyy-MM-dd  h:mm:ssZZZZZ')
    this.appointment.ToTime = this.datePipe.transform(this.appointment.ToTime, 'yyyy-MM-dd  h:mm:ssZZZZZ')
    const subscription = this.calenderService.addAppominets(this.appointment, this.userAuth[0].Register_Id).subscribe((data) => {
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

  getUsers() {
    const subscription = this.userServices.getUsers().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
console.log(data);
      this.users=data
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

}
