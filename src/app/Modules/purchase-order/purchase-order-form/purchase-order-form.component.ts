import { Component, EventEmitter, Input, OnInit, Output, ViewChild,OnChanges, SimpleChanges  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { PurchaseOrder } from 'src/app/modals/po';
import { Vendor } from 'src/app/modals/vendors';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { CalenderService } from '../../calender/calender.service';
import { Products } from 'src/app/modals/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';
import { PurchaseOrderService } from '../purchase-order.service';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    EntityViewerComponent,
    ModalComponent,
    LoadingComponent,
  ],
})
export class PurchaseOrderFormComponent extends BaseComponent implements OnInit,OnChanges  {

 
  vendors: Vendor[] | any
  showProductsDialog:boolean=false
  showPaymentDialog:boolean=false
  products=[]
  selectProducts: Products[] = []
  payments:any[]=[]
  id
  paymentAmount:number=0
  @Input() po:PurchaseOrder |any
  @Input() display: boolean = false
  @Input() detailMode: boolean = false

  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('payInput') payInput:InputComponent

  constructor(public translates: TranslateService, public messageService: MessageService,
    private calenderService: CalenderService,private purchaseOrderService:PurchaseOrderService,private confirmationService: ConfirmationService,public permisionServices:PermissionService,) {super(messageService,translates) }

  async ngOnInit(): Promise<void> {
    await this.getVendorsList(1,null)
   await this.getProducts(1,null)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['po'] && changes['po'].currentValue) {      
      this.getPO(changes['po'].currentValue.id)
    }else{
       this.po = new PurchaseOrder
      this.selectProducts = []
      this.payments = []
      this.po.selectedVendor = null
    }
  }
  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }

  createPO(addedToStuck?) {
    if (this.getTotalPrice().totalPayments>this.getTotalPrice().productsAmount) {
      this.errorMessage(null,'The payment amount should not be more than the total amount')
      return
    }
    this.po.products=this.selectProducts
    this.payments.map(x=>{
      x.approved=true
    })
    this.po.payments=this.payments
    this.po.cash=this.getTotalPrice().totalPayments
    this.po.addedToStuck=addedToStuck
    if (this.getTotalPrice().totalPayments==0) {
      this.po.status='Draft'
    }else if(this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount){
      this.po.status='Paid'
      this.po.addedToStuck=true
    }else{
      this.po.status='Unpaid'
    }
    const subscription = this.purchaseOrderService.createPO(this.po).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.successMessage(null,'The pruchase order has been created')
      this.display = false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  updatePo(addedToStuck?) {
     if (this.getTotalPrice().totalPayments>this.getTotalPrice().productsAmount) {
      this.errorMessage(null,'The payment amount should not be more than the total amount')
      return
    }
    this.po.products=this.selectProducts
    this.payments.map(x=>{
      x.approved=true
    })
    this.po.payments=this.payments
    this.po.cash=this.getTotalPrice().totalPayments
    this.po.addedToStuck=addedToStuck
    if (this.getTotalPrice().totalPayments==0) {
      this.po.status='Draft'
    }else if(this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount){
      this.po.status='Paid'
      this.po.addedToStuck=true
    }else{
      this.po.status='Unpaid'
    }
    const subscription = this.purchaseOrderService.updatePO(this.po,this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.successMessage(null,'The pruchase order has been updated')
      this.display = false
      this.refreshLish.emit(true)
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  getPO(id) {
   
    const subscription = this.purchaseOrderService.getPO(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.id=data.data.id
      this.po = data.data.attributes
      this.selectProducts=this.po.products
      
      this.po.selectedVendor=this.po.vendor.data.attributes
      this.po.vendor=this.po.vendor.data
      this.payments=this.po.payments
      this.po.createdAt = moment(this.po.createdAt).format('YYYY-MM-DD HH:mm')      
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

    getVendorsList(pageNum?: number, query?: any) {
  
      this.loading = true
      const subscription = this.calenderService.getlist('vendors', pageNum, 10000, query,'name').subscribe((results: any) => {
        this.loading = false
        if (!isSet(results)) {
          return
        }
        this.vendors = results.data
        subscription.unsubscribe()
      }, error => {
        this.loading = false
        subscription.unsubscribe()
      })
    }

    selectVendor(data){
    this.po.selectedVendor=data.value.attributes
      
    }

    getProducts(pageNum?: number, query?: any) {
      this.loading = true
      const subscription = this.calenderService.getlist('products', pageNum, 1000, query).subscribe((results: any) => {
        this.loading = false
        if (!isSet(results)) {
          return
        }
        results.data.map(item => {
          this.products.push({ id: item?.id, name: item?.attributes?.name, stocks: item?.attributes?.stocks, sellPrice: item?.attributes?.sellPrice, brand: item?.attributes?.brand?.data?.attributes })
        })
        subscription.unsubscribe()
      }, error => {
        this.loading = false
  
        subscription.unsubscribe()
      })
    }
    selectedProduct(data) {
        if (!isSet(this.selectProducts)) {
          this.selectProducts = []
        }
        const existServ = this.selectProducts.find(x => x.id == data.id)
        if (existServ) {
          this.errorMessage(this.trans('This Product Already Selected'))
          return
        }
        this.selectProducts.push(Products.cloneObject({
          id: data?.id,
          name:data?.name,
          stocks: data?.stocks?data?.stocks:0,
          brand: data?.brand,
          qty: 1,
          sellPrice:data?.sellPrice?data?.sellPrice:0
        }))
        this.showProductsDialog = false
        
      }
      deleteValue(index) {
        this.selectProducts.splice(index, 1)
      }

      getTotalPrice() {
        let productsAmount: number = 0
        let totalPayments:number =0
        this.selectProducts?.map(x => {
          productsAmount += x?.sellPrice * x?.qty
        })
        this.payments?.map(x => {
         totalPayments += JSON.parse(x?.pay) 
        })        

        return {
          productsAmount,totalPayments
    
        }
      }
      openPaymentDialog(){
        this.paymentAmount=0
       this.showPaymentDialog=true
       this.payInput.selectInput()
      }
      addPayments(){
        if (this.paymentAmount ==0) {
          return
        }
        this.payments.push({pay:this.paymentAmount,date:moment().format('YYYY-MM-DD hh:mm'),approved:false})
        this.showPaymentDialog=false
      }
      onKeyEnterPay(event){
         if (event.keyCode === 13) {
     this.addPayments()

    }
      }
      removePay(i){
        this.payments.splice(i, 1)

      }
      createPOandAddToStuck() {
        this.confirmationService.confirm({
          message: this.trans('Do you want to add products to Stock ?'),
          header: this.trans('Confirmation'),
          icon: 'pi pi-box',
          accept: () => {this.createPO(true); this.updateStock() },
          reject:()=>{this.createPO(false)}
        });
      }
      updatePOandAddToStuck() {
        this.confirmationService.confirm({
          message: this.trans('Do you want to add products to Stock ?'),
          header: this.trans('Confirmation'),
          icon: 'pi pi-box',
          accept: () => {this.updatePo(true); this.updateStock() },
          reject:()=>{this.updatePo(false)}
        });
      }

      updateStock(){
        const subscription = this.purchaseOrderService.updateStock(this.selectProducts).subscribe((data) => {
          if (!isSet(data)) {
            return
          }
          subscription.unsubscribe()
        }, error => {
          subscription.unsubscribe()
        })
      }
      saveOptions(){
        if (this.getTotalPrice().totalPayments==0) {
          this.createPOandAddToStuck()
        }else if(this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount){
          this.createPO(true)
          this.updateStock()
        }else{
          this.createPOandAddToStuck()
        }
      }
      updateOptions(){
        if (this.getTotalPrice().totalPayments==0) {
          this.updatePo(false)
        }else if((this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount)&& !this.po.addedToStuck){
          this.updatePo(true)
          this.updateStock()
        }else if((this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount)&& this.po.addedToStuck){
          this.updatePo(true)
        }
        else if(!this.po.addedToStuck){
          this.updatePOandAddToStuck()
        }else(
          this.updatePo()
        )
      }

      cashAllAmount(){
         if (this.getTotalPrice().totalPayments==this.getTotalPrice().productsAmount) {
          return
        }
        let amountDedecte=this.getTotalPrice().productsAmount-this.getTotalPrice().totalPayments
        this.payments.push({pay:amountDedecte,date:moment().format('YYYY-MM-DD hh:mm'),approved:false})
      }
}
