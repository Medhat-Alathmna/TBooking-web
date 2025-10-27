import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';
import { ExcelExportComponent } from 'src/app/Shared/excel-export/excel-export.component';
import { ChatComponent } from 'src/app/Shared/chat/chat.component';



export const routes: Routes = [
  { path: '', component: OrdersComponent },

];

@NgModule({
  declarations: [
    OrdersComponent,
    
  ],
  imports: [
    CommonModule,
    ChatComponent,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    AddEditOrderComponent,
    InputComponent,
    ExcelExportComponent,
    LoadingComponent
  ]
})
export class OrdersModule { }
