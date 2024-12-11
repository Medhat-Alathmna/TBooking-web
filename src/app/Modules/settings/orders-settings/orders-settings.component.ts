import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettingsService } from '../settings.service';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-orders-settings',
  templateUrl: './orders-settings.component.html',
  styleUrls: ['./orders-settings.component.scss']
})
export class OrdersSettingsComponent extends BaseComponent implements OnInit {

  data
  constructor(public translates: TranslateService, public messageService: MessageService,
    private settingsService: SettingsService,) { super(messageService, translates) }

   ngOnInit() {
    this.getOrderPicSettings()
  }
  updateOrderPicSettings() {
    this.loading = true
    const subscription = this.settingsService.updateOrderPicSettings(this.data).subscribe((results: any) => {
      this.data=results.data.attributes
      this.successMessage(null,'Entry Updated Successfully')
      this.loading = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  getOrderPicSettings() {
    this.loading = true
    const subscription = this.settingsService.getOrderPicSettings().subscribe((results: any) => {
      this.loading = false
       this.data=results.data.attributes
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
}
