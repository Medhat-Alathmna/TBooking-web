import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileAppComponent } from './mobile-app/mobile-app.component';
import { ProductsComponent } from '../products/products/products/products.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { GallaryComponent } from './gallary/gallary.component';
import { SafePipe } from 'src/app/Shared/safe.pipe';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';

export const routes: Routes = [
  { path: '', component: MobileAppComponent },

];

@NgModule({
  declarations: [
    MobileAppComponent,
    GallaryComponent,
    SafePipe,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,LoadingComponent,
    InputComponent,InputMaskComponent
  ]
})
export class MobileAppModule { }
