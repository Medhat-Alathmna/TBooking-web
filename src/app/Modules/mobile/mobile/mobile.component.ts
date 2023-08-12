import { Component, OnInit } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MobileService } from '../mobile.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Services } from 'src/app/modals/service';


@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent extends BaseComponent implements OnInit {

  tabSelected = 'service'
  editMode:boolean=false
  showServ: boolean = false
  Service = new Services
  services: any = []
  tabIndex = [
    {
      label: this.trans('Services'),
      command: event => {
        this.tabSelected = 'service'
        this.listServices()
      }
    },
    {
      label: 'Home',
      command: event => {
        this.tabSelected = 'home'
      }
    }
  ]
  constructor(public translates: TranslateService, public messageService: MessageService,
     private mobileService: MobileService,private confirmationService: ConfirmationService) { super(messageService, translates) }

  ngOnInit(): void {
    this.listServices()
  }




  listServices() {
    this.loading = true
    const subscription = this.mobileService.getServices().subscribe((results: any[]) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.services = results
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }

  showServices(value) {    
    this.Service =Services.cloneObject(value) 
    this.Service.en =value?.attributes.en
    this.Service.ar =value?.attributes.ar
    this.Service.price =value?.attributes?.price
    this.editMode=true
    this.showServ = true
  }
  showcreateDialog() {
    this.editMode=false
    this.Service=new Services
    this.showServ = true
  }
  createService() {
    const subscription = this.mobileService.createService(this.Service).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.listServices()
      this.showServ = false
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  updateService() {
    const subscription = this.mobileService.updateService(this.Service).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.showServ = false
      this.listServices()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  confirm1Delete(id) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this service ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {this.deleteSerive(id) ;console.log(id);
        },
    });
  }
  deleteSerive(id){
    const subscription = this.mobileService.hideServies(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.listServices()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }


}
