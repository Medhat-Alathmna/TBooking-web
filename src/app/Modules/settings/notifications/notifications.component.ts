import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { SettingsService } from '../settings.service';
import { Notifications } from 'src/app/modals/notfi';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService, public messageService: MessageService, private settingsService: SettingsService) { super(messageService, translates) }
  appointments = []
  orders = []
  bodyDialog: boolean = false
  info: boolean = false
  selectedBody = new Notifications
  tabSelected='appo'
  tabIndex = [
    {
      label: this.trans('Appointments'),
      command: event => {
        this.tabSelected = 'appo'
      }
    },
    {
      label: 'Order',
      command: event => {
        this.tabSelected = 'order'
      }
    },
  ]
  ngOnInit(): void {
    this.getNotfi()
  }
  getNotfi() {
    this.loading=true

    const subscription = this.settingsService.getNotifications().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.loading=false
      console.log(results);
      this.appointments = results.data.filter(x => x.attributes.type == 'Appointment')
      this.orders = results.data.filter(x => x.attributes.type == 'Orders')

      subscription.unsubscribe()
    }, error => {
      this.loading=false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  initNotfi(type) {
    this.selectedBody = new Notifications
    this.selectedBody.type=type
    this.bodyDialog = true
  }

  createNotfication() {
    this.loading=true
    const subscription = this.settingsService.createNotifications(this.selectedBody).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      console.log(data);
      
      this.bodyDialog = false
      this.loading = false
      this.getNotfi()

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
}
