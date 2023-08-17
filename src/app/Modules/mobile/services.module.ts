import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileComponent } from './services/services.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { ProductsComponent } from './products/products/products.component';
import { AddEditProductsComponent } from './products/add-edit-products/add-edit-products.component';


export const routes: Routes = [
  { path: '', component: MobileComponent },

];

@NgModule({
  declarations: [
    MobileComponent,
    ProductsComponent,
    
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    InputComponent,
    AddEditProductsComponent,
    LoadingComponent
  ]
})
export class MobileModule { }
