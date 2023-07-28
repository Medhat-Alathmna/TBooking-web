import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { id } from 'date-fns/locale';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { CalenderService } from '../calender.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent extends BaseComponent implements OnInit {

  appointments:any=[]

  constructor(public translates: TranslateService,
    public messageService: MessageService, private calenderService:CalenderService) {super(messageService,translates) }

  ngOnInit(): void {
    this.getAppointment()
  }

  getAppointment() {
    this.loading = true
    const subscription = this.calenderService.getAllApointemnts().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);
      this.appointments=results.data
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
}
