import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StockMovement, StockAdjustmentPayload, Products } from 'src/app/modals/products';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/Shared/input/input.component';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss'],
  standalone:true,
  imports:[FormsModule,
      TranslateModule,
      CommonModule,
      PrimengComponentsModule,
      InputComponent
      
    ]
})
export class StockAdjustmentComponent implements OnInit {
  loading: boolean = false;
  submitting: boolean = false;

  products: Products[] = [];
  filteredProducts: Products[] = [];

  // Form fields using ngModel
@Input()  selectedProduct: Products | null = null;
  action: 'increase' | 'decrease' = 'increase';
  quantity: number = 0;
  cost?: number;
  reason: string = 'opening_balance';
  note: string = '';
  min:number=0
  max:number=0
  @Output() save: EventEmitter<any> = new EventEmitter();

  reasonList = [
    { label: 'جرد أولي', value: 'opening_balance' },
    { label: 'تعديل بعد جرد', value: 'count_adjustment' },
    { label: 'هدية من المورد', value: 'vendor_gift' },
    { label: 'إنتاج داخلي', value: 'inhouse_production' },
    { label: 'أخرى', value: 'other' }
  ];

  movements: StockMovement[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
  }

  async loadData() {
    this.loading = true;
    try {
      // this.products = await this.api.getProducts();
      // this.movements = await this.api.getRecentMovements();
    } finally {
      this.loading = false;
    }
  }



  async submit() {
    if (!this.selectedProduct || !this.quantity) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (this.action=='increase'&&this.quantity>=0 ) {
      alert('The quantity must be positive')
      return
    }else if(this.action=='decrease'&&this.quantity<=0 ){ 
      alert('The quantity must be negative')
      return
    }
this.save.next(this.selectedProduct)

   
  }


}