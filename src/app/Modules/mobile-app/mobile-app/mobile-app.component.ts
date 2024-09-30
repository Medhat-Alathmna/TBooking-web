import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MobileAppService } from '../mobile-app.service';

@Component({
  selector: 'app-mobile-app',
  templateUrl: './mobile-app.component.html',
  styleUrls: ['./mobile-app.component.scss']
})
export class MobileAppComponent extends BaseComponent implements OnInit {
  tabSelected = 'gallary'
  dataSetting
  tabIndex=[]
  constructor(public translates: TranslateService,
     public messageService: MessageService,private mobileService: MobileAppService,) {super(messageService, translates) }

  ngOnInit(): void {
    this.getMainSettings()
    setTimeout(() => {
      this.tabIndex = [
        {
          label: this.trans('Gallary'),
          command: event => {
            this.tabSelected = 'gallary'
          }
        },
        {
          label: this.trans('General Settings'),
          command: event => {
            this.tabSelected = 'main'
          }
        }
      ]
    });
  }

  getMainSettings(){
    this.loading = true
    const subscription = this.mobileService.getMainSettings().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.dataSetting=results.data.attributes
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
 updateMainSettings(type,value){
    this.loading = true
    const subscription = this.mobileService.updateMainSettings(type,value).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.successMessage(null ,type=='phone'?this.trans('The contact number changed'):this.trans('This Action Changed'))
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

}
