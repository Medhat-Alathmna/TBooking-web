import { Component, OnInit } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MobileService } from '../mobile.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Services } from 'src/app/modals/service';
import { SubServices } from 'src/app/modals/subService';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent extends BaseComponent implements OnInit {

  tabSelected = 'service'
  showAEditSubServ: boolean = false
  showEditServ: boolean = false
  showAddServ: boolean = false
  editStatus: boolean = false
  Service = new Services
  SubService = new SubServices
  editSubService = new SubServices
  services: any = []
  Subservices: any = []
  subServiceIndex = null
  addKeyword: any

  tabIndex = [
    {
      label: 'Service',
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
  constructor(public translates: TranslateService, public messageService: MessageService, private mobileService: MobileService,) { super(messageService, translates) }

  ngOnInit(): void {
    console.log(this.userAuth);

    this.listServices()

  }

  insertKeyWord(event) {
    if (event.keyCode === 13) {
      if (!this.SubService.name_ar || !this.SubService.name_en) return this.errorMessage('Rejected', 'Please reqiure Info')
      this.createSubService()
    }
  }


  listServices() {
    this.loading = true
    const subscription = this.mobileService.getServices().subscribe((results: Services[]) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.services = Services.cloneManyObjects(results) 
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  listubServices(id) {
    this.loading = true
    const subscription = this.mobileService.getSubServices(id).subscribe((results:SubServices []) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.Subservices =SubServices.cloneManyObjects(results) 
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  showServices(value) {
    this.Service =Services.cloneObject(value) 
    this.showEditServ = true
    this.listubServices(value.Service_Id)
  }
  showcreateDialog() {
    this.Service.service_en = null
    this.Service.service_ar = null
    this.showAddServ = true
  }
  createService() {
    if (!this.Service.service_ar || !this.Service.service_en) return this.errorMessage('Rejected', 'Please Insert reqiure Info')
    const subscription = this.mobileService.createService(this.Service).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.listServices()
      this.showAddServ = false
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  updateService() {
    if (!this.Service.service_ar || !this.Service.service_en) return this.errorMessage('Rejected', 'Please Insert reqiure Info')
    const subscription = this.mobileService.updateService(this.Service,1).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.showEditServ = false
      this.listServices()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  createSubService() {
    const subscription = this.mobileService.createSubService(this.SubService, this.Service.Service_Id, 1).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.Subservices.push({
        name_ar: this.SubService.name_ar,
        name_en: this.SubService.name_en,
      })
      this.SubService.name_ar = null
      this.SubService.name_en = null
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  showEditSub(value, index) {
    this.subServiceIndex = index
    this.showAEditSubServ = true
    this.editSubService = SubServices.cloneObject(value)
  }

  updateSubService() {
    if (!this.editSubService.name_ar || !this.editSubService.name_en) return this.errorMessage('Rejected', 'Please reqiure Info')
    const subscription = this.mobileService.updateSubService(this.editSubService, this.Service.Service_Id, 1).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.Subservices[this.subServiceIndex] = { name_ar: this.editSubService.name_ar, name_en: this.editSubService.name_en, }
      this.showAEditSubServ = false
      this.editSubService.name_ar = null
      this.editSubService.name_en = null
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }


}
