import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PermissionService } from 'src/app/core/permission.service';
import { SettingsService } from '../settings.service';
import { Notifications } from 'src/app/modals/notfi';

@Component({
  selector: 'app-push-notifiction',
  templateUrl: './push-notifiction.component.html',
  styleUrls: ['./push-notifiction.component.scss']
})
export class PushNotifictionComponent extends BaseComponent implements OnInit {
  tabSelected='Approved Appointments'
  appointmentsApproved=[]
  appointmentsRejected=[]
  allUsers=[]
  bodyDialog: boolean = false
  info: boolean = false
  editMode: boolean = false
  selectedBody = new Notifications
  tabIndex = [  ]
 constructor(public translates: TranslateService, public messageService: MessageService, public permissionService:PermissionService,
     private confirmationService: ConfirmationService, private settingsService: SettingsService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getNotfi()
    setTimeout(() => {
       this.tabIndex = [
    {
      label: this.trans( 'Approved Appointments'),
      command: event => {
        this.tabSelected = 'Approved Appointments'
      }
    },
    {
      label: this.trans('Rejected Appointments'),
      command: event => {
        this.tabSelected = 'Rejected Appointments'
      }
    },
    {
      label: this.trans('All users'),
      command: event => {
        this.tabSelected = 'All users'
      }
    },
  
  ]
    });
  }
 getNotfi() {
    this.loading=true
    const subscription = this.settingsService.getMobileNotifications().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.loading=false
      this.appointmentsApproved = results.data.filter(x => x.attributes.type == 'Approved Appointments')
      this.appointmentsRejected = results.data.filter(x => x.attributes.type == 'Rejected Appointments')
      this.allUsers = results.data.filter(x => x.attributes.type == 'All users')
      subscription.unsubscribe()
    }, error => {
      this.loading=false
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
      const subscription = this.settingsService.createMobileNotifications(this.selectedBody).subscribe((data) => {
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
    const subscription = this.settingsService.updateMobileNotifications(this.selectedBody).subscribe((data) => {
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
    const subscription = this.settingsService.deleteMobileNotifications(this.selectedBody).subscribe((data) => {
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
