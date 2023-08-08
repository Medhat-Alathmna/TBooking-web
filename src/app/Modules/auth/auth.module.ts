import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import {MenuModule} from 'primeng/menu';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forget', component: ForgetPasswordComponent },

];

@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
    PasswordModule,
    TranslateModule,
    FormsModule,
    ToastModule,
    LoadingComponent,
    MenuModule,
    
  ]
})
export class AuthModule { }
