import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StockMovement, StockAdjustmentPayload, Products } from 'src/app/modals/products';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    CommonModule,
    PrimengComponentsModule,
    LoadingComponent

  ]
})
export class StockAdjustmentComponent extends BaseComponent implements OnInit {
  loading: boolean = false;
  submitting: boolean = false;

  products: Products[] = [];
  filteredProducts: Products[] = [];

  // Form fields using ngModel
  stock: StockAdjustmentPayload = new StockAdjustmentPayload()

  @Input() selectedProduct: Products 
  @Input() id: any 
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter();



  reasonList = [
    { label: this.trans('Opening Balance'), value: 'Opening Balance' },
    { label: this.trans('Count Adjustment'), value: 'Count Adjustment' },
    { label: this.trans('Vendor Gift'), value: 'Vendor Gift' },
    { label: this.trans('Inhouse Production'), value: 'Inhouse Production' },
    { label: this.trans('Other'), value: 'Other' }
  ];

  movements: StockMovement[] = [];

  constructor(public translates: TranslateService, public messageService: MessageService, private productService: ProductsService, confirmationService: ConfirmationService) { super(messageService, translates, confirmationService) }

  ngOnInit(): void {
    this.stock.reason = 'Opening Balance'
    this.stock.action = 'increase'
    this.stock.product=this.id    
    this.stock.stocks=this.selectedProduct.stocks    
    this.getStockAdjustment()
    this.createStockAdjustmenEmmiter()
  }



  onQuantityChange() {
    if (this.stock.quantity) {
      // if (this.action === 'increase') {
      //   this.quantity = Math.abs(this.quantity);
      // } else if (this.action === 'decrease') {
      //   this.quantity = -Math.abs(this.quantity);
      // }
      this.stock.quantity = this.stock.action === 'increase' ? Math.abs(this.stock.quantity) : -Math.abs(this.stock.quantity);


    }
  }

  createStockAdjustmenEmmiter() {
    const sub = this.productService.saveStockAdjustmentEmitter.subscribe({
      next: (data) => {
        if (!data) {
          return
        }
        this.createStockAdjustment()
        this.subscriptions.push(sub);
       
      },
    })
  }

  createStockAdjustment() {
    this.loading = true
    const sub = this.productService.createAdjustment(this.stock).subscribe({
      next: (data) => {
        if (!isSet(data)) {
          return
        }
        this.successMessage(null, 'This Stock has been changed')
      },
      error:(err) => {
        this.errorMessage(null,err.error.message)
      },
      complete: () => {
        this.loading = false
         this.productService.saveStockAdjustment.next(false)
        this.displayChange.emit(false)
        this.refreshList.emit(true)
        sub.unsubscribe()
      }
    })


  }
  getStockAdjustment() {
    this.loading = true
    const sub = this.productService.productLogs(this.id).subscribe({
      next: (data) => {
        if (!isSet(data)) {
          return
        }
       
      },
      complete: () => {
        this.loading = false
        sub.unsubscribe()
      }
    })

  }
}


