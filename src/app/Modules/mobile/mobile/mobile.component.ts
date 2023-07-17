import { Component, OnInit } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { MobileService } from '../mobile.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent extends BaseComponent implements OnInit {

  tabSelected = 'service'
  showEditKey: boolean = false
  showEditServ: boolean = false
  showAddServ: boolean = false
  editStatus: boolean = false
  editService = { service_en: null, service_ar: null }
  editSubService = { name_ar: null, name_en: null }
  services: any = []
  Subservices: any = []

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
  constructor(public translates: TranslateService,public messageService: MessageService,private mobileService: MobileService,)
   { super(messageService,translates) }

  ngOnInit(): void {
    this.listServices()

  }

  insertKeyWord(event) {
    if (event.keyCode === 13) {
      if (!this.editSubService.name_ar || !this.editSubService.name_en) return this.errorMessage('Rejected', 'Please reqiure Info')
      this.Subservices.push({
        name_ar: this.editSubService.name_ar,
        name_en: this.editSubService.name_en,
      })
      console.log(this.Subservices);

      this.editSubService.name_ar = null
      this.editSubService.name_en = null
    }
  }

  showEditService(value, index) {
    this.editService = value.name
    this.showEditKey = true
  }

  listServices() {
    this.loading = true
    const subscription = this.mobileService.getServices().subscribe((results: []) => {
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
  listubServices(id) {
    this.loading = true
    const subscription = this.mobileService.getSubServices(id).subscribe((results: []) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }      
      this.Subservices = results
      this.showEditServ = true
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      subscription.unsubscribe()
    })
  }
  showServices(value) {
    console.log(value);
    this.editService=value
    this.listubServices(value.Service_Id)
  }
  showcreateDialog(){
    this.editService.service_en=null
    this.editService.service_ar=null
    this.showAddServ=true
  }
  createService() {
    if (!this.editService.service_ar || !this.editService.service_en) return this.errorMessage('Rejected', 'Please Insert reqiure Info')

    const subscription = this.mobileService.createService(this.editService).subscribe((data) => {
      if (!isSet(data)) {
        return
      } 
      this.listServices()
      this.showAddServ=false
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
}
