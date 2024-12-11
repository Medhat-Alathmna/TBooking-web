import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsMainComponent } from './settings-main/settings-main.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { ModalComponent } from 'src/app/Shared/modal/modal.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { ForbiddenNumbersComponent } from './forbidden-numbers/forbidden-numbers.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { ColorInputComponent } from 'src/app/Shared/color-input/color-input.component';
import { AppoSettingsComponent } from './appo-settings/appo-settings.component';
import { OrdersSettingsComponent } from './orders-settings/orders-settings.component';


export const routes: Routes = [
  { path: '', component: SettingsMainComponent },

];
@NgModule({
  declarations: [
    SettingsMainComponent,
    NotificationsComponent,
    ForbiddenNumbersComponent,
    SiteSettingsComponent,
    AppoSettingsComponent,
    OrdersSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    ModalComponent,
    InputComponent,
    ColorInputComponent,
    TextAreaComponent,
    InputMaskComponent,
    LoadingComponent
  ]
})
export class SettingsModule { }
