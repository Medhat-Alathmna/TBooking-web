import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
import { ColumnFilterComponent } from 'src/app/Shared/column-filter/column-filter.component';


export const routes: Routes = [
  { path: '', component: PurchaseOrderListComponent },

];


@NgModule({
  declarations: [PurchaseOrderListComponent],
  imports: [
      CommonModule,
        RouterModule.forChild(routes),
        PrimengComponentsModule,
        TranslateModule,
        PurchaseOrderFormComponent,
        ColumnFilterComponent
    
  ]
})
export class PurchaseOrderModule { }
