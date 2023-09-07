import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';



export const routes: Routes = [
  { path: '', component: DashboardComponent },

];

@NgModule({
  declarations: [
    DashboardComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    ModalComponent,
    LoadingComponent
  ]
})
export class DashboardModule { }
