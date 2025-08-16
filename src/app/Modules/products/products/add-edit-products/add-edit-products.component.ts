import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { FromToDateComponent } from 'src/app/Shared/from-to-date/from-to-date.component';
import { AddEditOrderComponent } from 'src/app/Modules/orders/add-edit-order/add-edit-order.component';
import { SupplierContact } from 'src/app/modals/supplierContact';
import { StockAdjustmentComponent } from '../stock-adjustment/stock-adjustment.component';
import { Menu } from 'primeng/menu';

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
    TextAreaComponent,
    ModalComponent,
    AddEditOrderComponent,
    LoadingComponent,
    EntityViewerComponent,
    StockAdjustmentComponent,
    FromToDateComponent,
  ],
})
export class AddEditProductsComponent extends BaseComponent implements OnInit {
  items
  acions
  catsMenu
  number
  headerDialog
  brandName: string
  selectedOrder: any
  basicOptions
  brands: any[] = []
  brandDialog: boolean = false
  brandMode: boolean = false
  brandEdit: boolean = false
  showStockAdjustment: boolean = false
  showOrderSidebar: boolean = false
  showSuppliersDialog: boolean = false
  showInfoDialog: boolean = false
  showCategoryDialog: boolean = false
  contactInfo = { header: null, body: null }
  showUpdateCatDialog: boolean = false;
  selectedCategory: any = { name: null, id: null };
  selectedApplyCategory: any = { index: null, cat: null };
  supplierInfo: any = { name: null, phone: null, email: null, note: null, address: null }
  editContactIndex
  ediContactMode
  fromDate: any
  toDate: any
  dashboardResults
  catName
  subCat
  editingCategoryIndex: number;
  editingItemIndex: number;
  subCatMode = false
  displayDate = false
  productChart
  dashboardDetails
  textSecondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--surface-500')


  selectedProduct: Products | any
  @Input() id: any
  @Input() display: boolean = false
  @Input() detailMode: boolean = true
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshLish: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('menu') menu: Menu

  constructor(public translates: TranslateService, public messageService: MessageService, public permissionService: PermissionService,
    confirmationService: ConfirmationService, private productsService: ProductsService) {
    super(messageService, translates, confirmationService)

  }

  ngOnInit(): void {

    this.catsMenu = [
      {
        label: this.trans('Add this Category for all products'),
        icon: 'pi pi-plus',
        command: () => {
          this.selectedApplyCategory.cat.subCategory.splice(0, 1)
          this.applayCatProducts()
        }
      },
      {
        label: this.trans('Delete'),
        icon: 'pi pi-trash',
        command: () => {
          // this.confirmProductDelete()
        }
      }
    ]
    this.detailMode ? this.getProduct() : this.initProduct()
    this.items = [
      {
        icon: 'pi pi-calendar text-primary',
        command: () => {
          this.displayDate = true
        }
      },
      {
        icon: 'pi pi-file text-primary',
        command: () => {
          this.dashboardDetails = true
        }
      },
      {
        icon: 'pi pi-refresh text-primary',
        command: () => {
          this.productInfo({ fromDate: new Date(), toDate: new Date() });

        }
      },

    ];


    this.getBrands()
  }

  onActionClick(event: MouseEvent) {
    this.acions = [
      {
        label: this.showStockAdjustment ? this.trans('Details') : this.trans('Stock adjustment'),
        icon: this.showStockAdjustment ? 'pi pi-file' : 'pi pi-shopping-cart',

        command: () => {
          this.showStockAdjustment =  !this.showStockAdjustment
        }
      },
      {
        label: this.trans('New Category'),
        icon: 'pi pi-plus',
        command: () => {
          this.showCategoryDialog = true
        }
      },
      {
        label: this.trans('Delete'),
        icon: 'pi pi-trash',
        disabled: !this.permissionService.hasPermission('Products', 'delete'),
        command: () => {
          this.confirmProductDelete()
        }
      }
    ]
    this.menu.hide();
    setTimeout(() => this.menu.show(event), 0);
  }
  initProduct() {
    this.selectedProduct = new Products
    this.selectedProduct.stocks = 0
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
      this.successMessage(null, 'The product has been created')
      this.refreshLish.emit(true)
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  AddCat() {
    if (!isSet(this.selectedProduct.category)) {
      this.selectedProduct.category = []

    }
    this.selectedProduct.category.push({
      category: this.catName, subCategory: [
        { name: `<span class="font-bold text-primary">${this.trans('Create New')}</span>`, id: 0 }
        , { name: this.subCat }
      ], selectedItem: { name: this.subCat }
    })
    this.showCategoryDialog = false
    this.catName = null
  }
  selectItem(categoryIndex: number, selectedItem: any) {
    this.editingCategoryIndex = categoryIndex
    if (selectedItem.id == 0) {
      this.showCategoryDialog = true
      this.subCatMode = true
      this.subCat = null
    } else {
      this.selectedProduct.category[categoryIndex].selectedItem = selectedItem;
    }

  }
  updateProduct() {
    this.loading = true
    const subscription = this.productsService.updateProduct(this.selectedProduct, this.id, 'update').subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.successMessage(null, 'This Product has been changed')
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  subAddCat() {
    this.selectedProduct.category[this.editingCategoryIndex].subCategory.push({ name: this.subCat })
    this.selectedProduct.category[this.editingCategoryIndex].selectedItem = { name: this.subCat }
    this.showCategoryDialog = false
  }
  getProduct() {
    this.loading = true
    const subscription = this.productsService.getProduct(this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.selectedProduct = data.data.attributes
      this.productInfo({ fromDate: new Date(), toDate: new Date() });
      if (!this.selectedProduct.category) {
        this.selectedProduct.category = []
      }
      this.selectedProduct.category?.forEach(cat => {
        cat?.subCategory?.unshift({ name: `<span class="font-bold text-primary">${this.trans('Create New')}</span>`, id: 0 })
        if (!cat.selectedItem) {
          cat.selectedItem = cat.subCategory[1]
        }
      });
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }

  selectBrand(event) {
    if (event.value.id == 0) {
      this.brandDialog = true
      this.brandName = null
      this.selectedProduct.brand = null
      this.brandEdit = false
    }
    this.brandMode = true
    this.headerDialog = this.brandEdit ? this.trans('Brand Modification') : this.trans('Brand Creation')
  }

  getBrands() {
    const subscription = this.productsService.getBrands().subscribe((results) => {
      if (!isSet(results)) {
        return
      }
      this.brands = []
      this.brands.push({
        id: 0, name: `<span class="font-bold text-primary">${this.trans('New Brand')}</span>`
      })
      results.data.map(item => {
        this.brands.push({
          id: item?.id, name: item?.attributes?.name
        })
      })
      if (this.selectedProduct.brand) {
        this.brandMode = true
        this.selectedProduct.brand = this.selectedProduct?.brand?.data?.attributes
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
      this.brandMode = false

      this.getBrands()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  updateBrand(type) {
    this.loading = true
    const subscription = this.productsService.updateBrand(this.brandName, this.selectedProduct.brand.id, type).subscribe((data) => {
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
  selectUpdateBrand(value) {
    this.brandEdit = true
    this.brandName = value.name
  }
  confirmCancel() {
    this.confirmMessage(null, () => {
      this.updateBrand('delete')
    });
  }
  productChartCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.productChart = {
      labels: [this.selectedProduct.name],
      datasets: [
        {
          label: (this.trans('Cash') + ' ' + this.getCurrencySymbol(this.cur.code)),
          data: [this.dashboardResults.totalRevenue],
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 1
        },
        {
          label: this.trans('Selling Times'),
          data: [this.dashboardResults.totalQty],
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          borderWidth: 1
        },
      ]
    };
    this.basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    };
  }
  public productInfo(dates: { fromDate: any; toDate: any }) {
    this.fromDate = dates.fromDate
    this.toDate = dates.toDate
    this.loading = true
    const subscription = this.productsService.productInfo(this.id, this.fromDate, this.toDate).subscribe((data: any) => {
      this.loading = false
      if (!isSet(data)) {
        return
      }
      this.displayDate = false

      this.dashboardResults = data
      this.productChartCharts()
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  viewOrder(event) {
    this.selectedOrder = event
    this.showOrderSidebar = true
  }
  confirmProductDelete() {
    this.confirmMessage(null, () => {
      this.hideProduct()
    });
  }
  hideProduct() {
    this.loading = true
    const subscription = this.productsService.updateProduct(this.selectedProduct, this.id, 'delete').subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.refreshLish.emit(true)
      this.successMessage(null, 'This Product has been deleted')
      this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  applayCatProducts() {
    this.loading = true
    const subscription = this.productsService.applayCatProducts(this.selectedApplyCategory.cat).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.successMessage(null, 'This Category has been added for all products')
      this.selectedApplyCategory = { index: null, cat: null };

      // this.display = false
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  openInfoDialog() {
    this.showInfoDialog = true
    this.contactInfo = { header: null, body: null }
  }
  openSuppliersDialog() {
    this.showSuppliersDialog = true
    this.supplierInfo = new SupplierContact
  }
  addInfoContact() {
    if (!isSet(this.selectedProduct.details)) {
      this.selectedProduct.details = []
    }
    this.selectedProduct.details.push(this.contactInfo)
    this.showInfoDialog = false


  }
  addSupplierContact() {
    if (!isSet(this.selectedProduct.suppliers)) {
      this.selectedProduct.suppliers = []
    }
    this.ediContactMode = false
    this.selectedProduct.suppliers.push(this.supplierInfo)
    this.showSuppliersDialog = false

  }
  removeContact(index) {
    this.selectedProduct.suppliers.splice(index, 1)
  }
  showEidtContact(index) {
    this.ediContactMode = true
    this.editContactIndex = index
    this.supplierInfo = Products.cloneObject(this.selectedProduct.suppliers[index])
    this.showSuppliersDialog = true
  }
  editContact() {
    this.selectedProduct.suppliers[this.editContactIndex] = this.supplierInfo
    this.showSuppliersDialog = false
  }
  removeDetails(index) {
    this.selectedProduct.details.splice(index, 1)
  }

  showUpdateDialog(category: any, item: any) {
    this.catName = null
    this.subCat = null
    this.editingCategoryIndex = this.selectedProduct.category.indexOf(category);
    this.editingItemIndex = this.selectedProduct.category[this.editingCategoryIndex].subCategory.indexOf(item);
    this.selectedCategory = { ...item }; // Make a copy to edit
    this.showUpdateCatDialog = true;
  }
  updateCategory() {
    if (
      this.editingCategoryIndex !== undefined &&
      this.editingItemIndex !== undefined
    ) {
      const category = this.selectedProduct.category[this.editingCategoryIndex];
      category.subCategory[this.editingItemIndex] = { ...this.selectedCategory };
      this.selectedProduct.category[this.editingCategoryIndex].selectedItem = { ...this.selectedCategory }
      this.showUpdateCatDialog = false;
    }
  }
  deleteSubCat(category: any, item: any) {
    this.editingCategoryIndex = this.selectedProduct.category.indexOf(category);
    this.editingItemIndex = this.selectedProduct.category[this.editingCategoryIndex].subCategory.indexOf(item);
    this.selectedProduct.category[this.editingCategoryIndex].subCategory.splice(this.editingItemIndex, 1)
    this.selectedProduct.category[this.editingCategoryIndex].selectedItem = this.selectedProduct.category[this.editingCategoryIndex].subCategory[1]
  }
  confirmCancelSubCat(category, item) {
    if (category.subCategory.length == 2) {
      this.errorMessage(null, this.trans('Must be there at least 1 Sub Category'))
      return
    }
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete this Entry ?'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteSubCat(category, item) },
    });
  }
  confirmCancelCat(index) {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to Delete this Entry ?'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.deleteCat(index) },
    });
  }
  deleteCat(index) {
    this.selectedProduct.category.splice(index, 1)
  }
  stockAdjustment(data){
    console.log(data);
    

  }
}
