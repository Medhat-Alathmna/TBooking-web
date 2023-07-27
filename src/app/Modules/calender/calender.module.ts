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
import { MultiSelectComponent } from 'src/app/Shared/multi-select/multi-select.component';
import { InputMaskComponent } from 'src/app/Shared/input-mask/input-mask.component';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

export const routes: Routes = [
  { path: '', component: FullCalenderComponent },

];

@NgModule({
  declarations: [FullCalenderComponent, ],
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
    MultiSelectComponent,
    TextAreaComponent,
    InputMaskComponent,
    EntityViewerComponent,
    InputComponent,
    LoadingComponent
  ]
})
export class CalenderModule { }
