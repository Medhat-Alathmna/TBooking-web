import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AddAppoComponent } from './add-appo/add-appo.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { FullCalenderComponent } from './full calender/fullCalender.component';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { FindUserComponent } from 'src/app/Shared/find-user/find-user.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { TableComponent } from 'src/app/Shared/table/table.component';
import { PermissionService } from 'src/app/core/permission.service';
import { ExcelExportComponent } from 'src/app/Shared/excel-export/excel-export.component';
import { TieredMenu } from 'primeng/tieredmenu';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

export const routes: Routes = [
  { path: '', component: FullCalenderComponent },

];

@NgModule({
  declarations: [FullCalenderComponent, AppointmentsComponent, ],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    AddAppoComponent,
    SidebarComponent,
    CalenderComponent,
    FindUserComponent,
    TextAreaComponent,
    InputMaskComponent,
    ExcelExportComponent,
    EntityViewerComponent,
    TableComponent,
    InputComponent,
    LoadingComponent
  ]
})
export class CalenderModule { }
