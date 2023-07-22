import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { DropdownComponent } from 'src/app/Shared/dropdown/dropdown.component';


export const routes: Routes = [
  { path: '', component: UsersComponent },

];

@NgModule({
  declarations: [UsersComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    InputComponent,
    SidebarComponent,
    CalenderComponent,
    AddEditUserComponent,
    DropdownComponent,
    LoadingComponent
  ]
})
export class UsersModule { }
