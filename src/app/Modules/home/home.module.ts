import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';


export const routes: Routes = [
  { path: '', component: HomeScreenComponent },

];

@NgModule({
  declarations: [
    HomeScreenComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    //
    PrimengComponentsModule,

    TranslateModule,
    LoadingComponent

  ]
})
export class HomeModule { }
