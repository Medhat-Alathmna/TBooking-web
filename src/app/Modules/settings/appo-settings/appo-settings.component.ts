import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appo-settings',
  templateUrl: './appo-settings.component.html',
  styleUrls: ['./appo-settings.component.scss']
})
export class AppoSettingsComponent extends BaseComponent implements OnInit {

  constructor(public translates: TranslateService, public messageService: MessageService,
     private settingsService: SettingsService, private confirmationService: ConfirmationService,) {super(messageService, translates)}

  ngOnInit(): void {
  }
  deleteUnapproved() {
    this.loading=true
    const subscription = this.settingsService.deleteUnapproved().subscribe((results: any) => {
      this.loading=false
    this.successMessage(null,'All Unapproved Appointments have been Deleted')
      subscription.unsubscribe()
    }, error => {
      this.loading=false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  convertDraftToCancel() {
    this.loading=true
    const subscription = this.settingsService.convertDraftToCancel().subscribe((results: any) => {
      this.loading=false
    this.successMessage(null,'All Drafted Appointments have been Cancelled')
      subscription.unsubscribe()
    }, error => {
      this.loading=false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  confirmDelete() {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete All Unapproved Appointments ?'),
      header: this.trans('Confirmation'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteUnapproved() },
    });
  }
  confirmConvert() {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Cancel All Drafted Appointments ?'),
      header: this.trans('Confirmation'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.convertDraftToCancel() },
    });
  }
}
