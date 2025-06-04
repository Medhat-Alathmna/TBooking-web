import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { VendorsFormComponent } from './vendors-form/vendors-form.component';
import { StaticsComponent } from './statics/statics.component';
import { ColumnFilterComponent } from 'src/app/Shared/column-filter/column-filter.component';



export const routes: Routes = [
  { path: '', component: VendorsListComponent },

];


@NgModule({
  declarations: [VendorsListComponent],
  imports: [
      CommonModule,
        RouterModule.forChild(routes),
        PrimengComponentsModule,
        TranslateModule,
        StaticsComponent,
        VendorsFormComponent,
        ColumnFilterComponent
    
  ]
})
export class VendorsModule { }
