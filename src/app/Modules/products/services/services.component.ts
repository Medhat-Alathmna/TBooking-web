import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import {  ProductsService } from '../services.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Services } from 'src/app/modals/service';
import { CalenderService } from '../../calender/calender.service';
import { Filter } from 'src/app/modals/filter';
import { PermissionService } from 'src/app/core/permission.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent extends BaseComponent implements OnInit {

  tabSelected = 'products'
  editMode:boolean=false
  showServ: boolean = false
  Service = new Services
  services: any = []
  rowNum: any = 10
  currentPage: any = 1
  total=0
  tabIndex=[]
keys = [
    { header:this.lang=='en'? 'Service EN':' الخدمة بالنجلزية', key: 'en' },
    { header:this.lang=='en'? 'Service AR':' الخدمة بالعربية', key: 'ar' },
    { header: this.lang=='en'?'Price':'سعر', key: 'price' },
  ]
  fillterFildes = {
    en: new Filter(),
    ar: new Filter(),
    price: new Filter(),
  }
  queryTypes = [

    {
      type: 'Not Equal',
      value: '$ne'
    },
    {
      type: 'Equal',
      value: '$eq'
    },
    {
      type: 'Less than',
      value: '$lt'
    },
    {
      type: 'Greater Than',
      value: '$gt'
    },

  ]

  @ViewChild('kt') table: Table;

  constructor(public translates: TranslateService, public messageService: MessageService,public permissionService:PermissionService, private calenderService:CalenderService,
     private mobileService: ProductsService,private confirmationService: ConfirmationService) { super(messageService, translates) }

  ngOnInit(): void {
    this.clearAllFillter()
    setTimeout(() => {
      this.tabIndex= [
        {
          label: this.trans('Products'),
          disabled:!this.permissionService.hasPermission('Products','view'),
          command: event => {
            this.tabSelected = 'products'
          }
        },
        {
          label: this.trans('Services'),
          disabled:!this.permissionService.hasPermission('Products','Services'),
          command: event => {
            this.tabSelected = 'service'
            this.listServices()
          }
        },
        
    
      ]
    }, );

  }




  listServices(pageNum?: number, query?: any) {
    this.loading = true
    const subscription = this.calenderService.getlist('services', pageNum, 10, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.services=[]
      const clone = results.data
      this.total = results.meta.pagination.total
      if (!isSet(this.services)) {
        this.services = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.services[index] = item
        })
      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.services[index] = clone[cloneObjIndex++]
        }
      }
      
      //
      if (!isSet(this.services?.next)) {
        this.services = this.services.filter(item => {
          return isSet(item)
        })
      }
      setTimeout(() => {
        this.table.first = pageNum > 1 ? (pageNum - 1) * this.rowNum : 0
      });
      subscription.unsubscribe()
    }, error => {
      this.loading = false
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
        message: this.trans('Are you sure that you want to delete this service ?') ,
        header:  this.trans('Confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {this.deleteSerive(id)},
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
  clearAllFillter() {
    this.fillterFildes = {
      en: new Filter(),
    ar: new Filter(),
    price: new Filter(),
    }
    this.calenderService.queryFilters = []
    this.listServices(1, null)
  }

}
