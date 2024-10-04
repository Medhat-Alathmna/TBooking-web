import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { SharedService } from '../shared.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ModalComponent } from '../modal/modal.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-pay-by',
  templateUrl: './pay-by.component.html',
  styleUrls: ['./pay-by.component.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule,ButtonModule,TranslateModule,InputComponent,DropdownModule ,ModalComponent ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PayByComponent,
      multi: true
    }]
})
export class PayByComponent extends BaseComponent implements ControlValueAccessor {

  bayPaies:any=[]
  payBayName:any
  payBayid:any
  headerDialog:string
  PayByDialog: boolean = false
  payByEdit: boolean = false
  role =JSON.parse(localStorage.getItem('role'))

  @Input() innerPayBy:any
  @Input() payByMode:any =false
  @Input() disabled:any =false

  constructor(messageService: MessageService, translates: TranslateService,private sharedServies:SharedService,private confirmationService: ConfirmationService,) { super(messageService,translates)}

  ngOnInit(): void {
    this.getPayBy()    
  }

  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};


  set payBy(v: any) {
    if (v !== this.innerPayBy) {
      this.innerPayBy = v;
      this.onChangeCallback(v);
    }
  }
  get payBy(): any {
    return this.innerPayBy;
  }

  writeValue(value: any) {
    if (value !== this.innerPayBy) {
      this.innerPayBy = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public validate(c: FormControl) {
    return c.errors;
  }
  getPayBy() {
    const subscription = this.sharedServies.getpayBy().subscribe((results:any) => {
      if (!isSet(results)) {
        return
      }
      this.bayPaies=[]
      this.bayPaies.push({
        id: 0, name: `<span class="font-bold text-primary">${this.trans('New Payment Method')}</span>`})
      results.data.map(item => {
        this.bayPaies.push({
          id: item?.id, name: item?.attributes?.name})
      })
      // if (this.selectedProduct.brand) {
      //   this.payByMode=true
      //   this.selectedProduct.brand=this.selectedProduct.brand.data.attributes
      // }
     
      
        subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  selectPayBy(event){
    if (event.value.id == 0) {
      this.PayByDialog = true
      this.payBy=null
      this.payBayName = null
      this.payByEdit=false
      this.payByMode=false
    }else{
      this.payByMode=true

    }
    this.headerDialog=this.payByEdit?this.trans('Payment Method Modification'):this.trans('Payment Method Creation')
  }
  createPayBy(){
    this.loading = true
    const subscription = this.sharedServies.createPayBy(this.payBayName).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      console.log(data);
      this.loading = false
      this.PayByDialog = false
      this.payByMode=false
      this.getPayBy()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updatePayBy(type) {    
    this.loading = true
    const subscription = this.sharedServies.updatePayBy(this.payBayName,this.payBayid,type).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      console.log(data);
      this.loading = false
      this.PayByDialog = false
      this.payByMode = false
      this.payBy=null
      this.getPayBy()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  selectUpdatePayBy(event){    
    this.payByEdit=true
    this.payBayName=event.name
    this.payBayid=event.id
  }
  confirmCancel(id) {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete this Entry ?'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.payBayid=id;this.updatePayBy('delete') },
    });
  }
}
