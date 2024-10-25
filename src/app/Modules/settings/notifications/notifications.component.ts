import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { SettingsService } from '../settings.service';
import { Notifications } from 'src/app/modals/notfi';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService, public messageService: MessageService, public permissionService:PermissionService,
    private confirmationService: ConfirmationService, private settingsService: SettingsService) { super(messageService, translates) }
  appointments = []
  orders = []
  group = []
  bodyDialog: boolean = false
  info: boolean = false
  editMode: boolean = false
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
      label: this.trans('Orders'),
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
    this.selectedBody.body=''
    this.editMode=false
    this.selectedBody.type=type
    this.bodyDialog = true
  }

  createNotfication() {
    this.loading=true
    const subscription = this.settingsService.createNotifications(this.selectedBody).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.bodyDialog = false
      this.loading = false
      this.getNotfi()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateNotifications() {
    this.loading=true
    const subscription = this.settingsService.updateNotifications(this.selectedBody).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.bodyDialog = false
      this.loading = false
      this.getNotfi()

      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  deleteNotifications() {
    this.loading=true
    const subscription = this.settingsService.deleteNotifications(this.selectedBody).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.bodyDialog = false
      this.loading = false
      this.getNotfi()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  showNotfi(notfi){
    this.bodyDialog=true
    this.editMode=true
    this.selectedBody.title=notfi.attributes.title
    this.selectedBody.body=notfi.attributes.body
    this.selectedBody.type=notfi.attributes.type
    this.selectedBody.id=notfi.id
  }
  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Notification ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteNotifications() },
    });
  }
}
