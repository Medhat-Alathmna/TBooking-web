import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { Products } from 'src/app/modals/products';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { ProductsService } from '../products.service';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-add-edit-products',
  templateUrl: './add-edit-products.component.html',
  styleUrls: ['./add-edit-products.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    CalenderComponent,
    EntityViewerComponent,
    TextAreaComponent,
    ModalComponent,
    InputMaskComponent,
    LoadingComponent,
  ],
})
export class AddEditProductsComponent extends BaseComponent implements OnInit {

  acions
  number
  headerDialog
  brandName: string
  brands:any[] = []
  brandDialog: boolean = false
  brandMode: boolean = false
  brandEdit: boolean = false
  @Input() selectedProduct: Products
  @Input() id: any
  @Input() display: boolean = false
  @Input() detailMode: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();

  constructor(public translates: TranslateService, public messageService: MessageService,public permissionService:PermissionService,
      private confirmationService: ConfirmationService,private productsService: ProductsService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getBrands()
    if (!this.selectedProduct.stocks) {
      this.selectedProduct.stocks=0
     }

  }

  onHide() {

    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }
  createProduct() {
    this.loading = true
    const subscription = this.productsService.createProduct(this.selectedProduct).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateProduct() {
    this.loading = true
    const subscription = this.productsService.updateProduct(this.selectedProduct, this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  selectBrand(event){
    if (event.value.id == 0) {
      this.brandDialog = true
      this.brandName = null
      this.selectedProduct.brand=null
      this.brandEdit=false
    }
    this.brandMode=true
    this.headerDialog=this.brandEdit?this.trans('Brand Modification'):this.trans('Brand Creation')
  }

  getBrands() {
    
    const subscription = this.productsService.getBrands().subscribe((results) => {
      if (!isSet(results)) {
        return
      }
      this.brands=[]
      this.brands.push({
        id: 0, name: `<span class="font-bold text-primary">${this.trans('New Brand')}</span>`})
      results.data.map(item => {
        this.brands.push({
          id: item?.id, name: item?.attributes?.name})
      })
      if (this.selectedProduct.brand) {
        this.brandMode=true
        this.selectedProduct.brand=this.selectedProduct.brand.data.attributes
      }
  
        subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  createBrand() {
    this.loading = true
    const subscription = this.productsService.createBrand(this.brandName).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.loading = false
      this.brandDialog = false
      this.brandMode=false

      this.getBrands()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateBrand(type) {
    this.loading = true
    const subscription = this.productsService.updateBrand(this.brandName,this.selectedProduct.brand.id,type).subscribe((data) => {
      if (!isSet(data)) {
        return
      }      
      this.loading = false
      this.brandDialog = false
      this.getBrands()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  selectUpdateBrand(value){
    this.brandEdit=true
    this.brandName=value.name
  }
  confirmCancel() {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete this Entry ?'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.updateBrand('delete') },
    });
  }
}
